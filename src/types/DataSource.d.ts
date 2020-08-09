interface DataSource
extends Identified {
    datasets: Dataset[];
}

interface Dataset
extends Identified {
    description: string;

    source: string;

    xType: string;
    yType: string;

    availableXRange: [ any, any ];

    variants?: string[];
}