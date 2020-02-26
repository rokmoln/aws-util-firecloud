export declare let awsInstanceTypeToArch: {
    readonly 't1.micro': "PV64";
    readonly 't2.nano': "HVM64";
    readonly 't2.micro': "HVM64";
    readonly 't2.small': "HVM64";
    readonly 't2.medium': "HVM64";
    readonly 't2.large': "HVM64";
    readonly 'm1.small': "PV64";
    readonly 'm1.medium': "PV64";
    readonly 'm1.large': "PV64";
    readonly 'm1.xlarge': "PV64";
    readonly 'm2.xlarge': "PV64";
    readonly 'm2.2xlarge': "PV64";
    readonly 'm2.4xlarge': "PV64";
    readonly 'm3.medium': "HVM64";
    readonly 'm3.large': "HVM64";
    readonly 'm3.xlarge': "HVM64";
    readonly 'm3.2xlarge': "HVM64";
    readonly 'm4.large': "HVM64";
    readonly 'm4.xlarge': "HVM64";
    readonly 'm4.2xlarge': "HVM64";
    readonly 'm4.4xlarge': "HVM64";
    readonly 'm4.10xlarge': "HVM64";
    readonly 'c1.medium': "PV64";
    readonly 'c1.xlarge': "PV64";
    readonly 'c3.large': "HVM64";
    readonly 'c3.xlarge': "HVM64";
    readonly 'c3.2xlarge': "HVM64";
    readonly 'c3.4xlarge': "HVM64";
    readonly 'c3.8xlarge': "HVM64";
    readonly 'c4.large': "HVM64";
    readonly 'c4.xlarge': "HVM64";
    readonly 'c4.2xlarge': "HVM64";
    readonly 'c4.4xlarge': "HVM64";
    readonly 'c4.8xlarge': "HVM64";
    readonly 'g2.2xlarge': "HVMG2";
    readonly 'g2.8xlarge': "HVMG2";
    readonly 'r3.large': "HVM64";
    readonly 'r3.xlarge': "HVM64";
    readonly 'r3.2xlarge': "HVM64";
    readonly 'r3.4xlarge': "HVM64";
    readonly 'r3.8xlarge': "HVM64";
    readonly 'i2.xlarge': "HVM64";
    readonly 'i2.2xlarge': "HVM64";
    readonly 'i2.4xlarge': "HVM64";
    readonly 'i2.8xlarge': "HVM64";
    readonly 'd2.xlarge': "HVM64";
    readonly 'd2.2xlarge': "HVM64";
    readonly 'd2.4xlarge': "HVM64";
    readonly 'd2.8xlarge': "HVM64";
    readonly 'hi1.4xlarge': "HVM64";
    readonly 'hs1.8xlarge': "HVM64";
    readonly 'cr1.8xlarge': "HVM64";
    readonly 'cc2.8xlarge': "HVM64";
};
export declare let getInstanceTypeToArch: ({ instanceType }: {
    instanceType: "t1.micro" | "t2.nano" | "t2.micro" | "t2.small" | "t2.medium" | "t2.large" | "m1.small" | "m1.medium" | "m1.large" | "m1.xlarge" | "m3.medium" | "m3.large" | "m3.xlarge" | "m3.2xlarge" | "m4.large" | "m4.xlarge" | "m4.2xlarge" | "m4.4xlarge" | "m4.10xlarge" | "m2.xlarge" | "m2.2xlarge" | "m2.4xlarge" | "cr1.8xlarge" | "r3.large" | "r3.xlarge" | "r3.2xlarge" | "r3.4xlarge" | "r3.8xlarge" | "i2.xlarge" | "i2.2xlarge" | "i2.4xlarge" | "i2.8xlarge" | "hi1.4xlarge" | "hs1.8xlarge" | "c1.medium" | "c1.xlarge" | "c3.large" | "c3.xlarge" | "c3.2xlarge" | "c3.4xlarge" | "c3.8xlarge" | "c4.large" | "c4.xlarge" | "c4.2xlarge" | "c4.4xlarge" | "c4.8xlarge" | "cc2.8xlarge" | "g2.2xlarge" | "g2.8xlarge" | "d2.xlarge" | "d2.2xlarge" | "d2.4xlarge" | "d2.8xlarge";
}) => "PV64" | "HVM64" | "HVMG2";