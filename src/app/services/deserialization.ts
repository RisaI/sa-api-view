const deserializers: { [key: string]: { size: number, parser: (view: DataView, pos: number) => any } } = {
    datetime: { size: 4, parser: (view, pos) => new Date(view.getInt32(pos, true) * 1000) },
    byte:     { size: 1, parser: (view, pos) => view.getInt8(pos) },
    boolean:  { size: 1, parser: (view, pos) => view.getInt8(pos) > 0 },
    short:    { size: 2, parser: (view, pos) => view.getInt16(pos, true) },
    int:      { size: 4, parser: (view, pos) => view.getInt32(pos, true) },
    // long:     { size: 8, parser: (view, pos) => view.getBigInt64(pos, true) },
    ushort:   { size: 2, parser: (view, pos) => view.getUint16(pos, true) },
    uint:     { size: 4, parser: (view, pos) => view.getUint32(pos, true) },
    // ulong:    { size: 8, parser: (view, pos) => view.getBigUint64(pos, true) },
    float:    { size: 4, parser: (view, pos) => view.getFloat32(pos, true) },
    // double:   { size: 8, parser: (view, pos) => view.getFloat64(pos, true) },
};

export async function deserialize(set: Dataset, stream: ArrayBuffer): Promise<{x: any[], y: any[]}> {
    const xD = deserializers[set.xType];
    const yD = deserializers[set.yType];

    if (!xD) {
        throw new Error(`Cannot deserialize type '${set.xType}'`);
    }

    if (!yD) {
        throw new Error(`Cannot deserialize type '${set.yType}'`);
    }

    const result: { x: any[], y: any[] } = { x: [], y: [] };
    const view = new DataView(stream);

    for (let i = 0; i < stream.byteLength;) {
        const x = xD.parser(view, i);
        i += xD.size;

        const y = yD.parser(view, i);
        i += yD.size;

        result.x.push(x);
        result.y.push(y);
    }

    return result;
}