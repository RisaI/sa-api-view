interface PipelineRequest {
    from: any,
    to: any,

    pipeline: NodeDescriptor,
}

type NodeDescriptor = DataNodeDescriptor | PipeDescriptor;

interface DataNodeDescriptor {
    type: 'data',
    dataset: {
        source: string,
        id: string,
        variant?: string,
    }
}

interface PipeDescriptor {
    type: string,
    options: { [k: string]: any },

    child: NodeDescriptor,
    children: NodeDescriptor[],
}