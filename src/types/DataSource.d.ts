interface DataSource
extends Identified {
    datasets: Dataset[];
    features: string[];
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

interface LdevInfo
{
    eccGroup: string;
    id: string;
    name: string;
    size: number;
    mpu: string;
    poolName: string;

    hostnames: string[];
    ports: string[];
    wwnNames: string[];
    wwnNicknames: string[];
}