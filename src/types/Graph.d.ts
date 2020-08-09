interface Graph {
    id: number;
    title: string;
    xLabel: string;
    yLabel: string;

    xType?: string;
    xRange?: [ any, any ];

    margin?: 0 | 1 | 2 | 3;

    traces: Trace[];
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