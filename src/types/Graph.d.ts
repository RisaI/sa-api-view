interface Graph {
    id: number;

    // Appearance
    title: string;
    xLabel: string;
    yLabel: string;
    margin?: 0 | 1 | 2 | 3;

    // Functionality
    xType?: string;
    traces: Trace[];

    // Runtime
    zoom?: [ [Date, Date], [any, any] ];
}

interface Trace {
    id: string;
    title: string;
    
    sourceId: string;
    datasetId: string;
    variant?: string;
    
    xRange?: [ any, any ];
}

type TraceAction = 'sel-unq' | 'sel-all' | 'inv' | 'des' | 'tres' |
    'sort' | 'filter' | 'search' | 'sum' | 'avg' |
    'del-zero' | 'del-sel' | 'del-unsel' |
    'name-sync' | 'zoom-sync' | 'bind-sync';