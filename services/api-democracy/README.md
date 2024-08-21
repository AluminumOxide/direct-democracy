# Democracy Service

## Data

```mermaid
flowchart RL
    subgraph democracy [Democracy Service]
    D[Democracy]
    end
    subgraph membership [Membership Service]
    M[Membership] --> D
    end
    subgraph proposal [Proposal Service]
    P[Proposal] --> D
    B[Ballot] --> P
    end
    P --> M
    B --> M
    here([You Are Here]) ==> democracy
    style here stroke:black,stroke-width:12px,fill:black,color:white;
```

Database tables are [documented](./schema/README.md) and specified in [/schema](./schema/). Each table has a `.sql` definition file and associated `.json` file containing test data. These files are loaded by the database docker container, which is managed by terraform in [/infra](../../infra).

## APIs

```mermaid
flowchart
    subgraph External Access
    U[UI] --> E[External API]
    end
    subgraph Internal Access
    E --> D[Democracy Service]
    E --> M[Membership Service]
    E --> P[Proposal Service]
    M --> D
    P --> D
    P --> M
    end
    here([You Are Here]) ==> D
    style here stroke:black,stroke-width:12px,fill:black,color:white;
```

API routes are specified in [spec.json](./spec.json). [Documentation](./source/README.md) is auto-generated from `spec.json` on server start. For convenience, consider using the [democracy service client library](./client/) for service access.

## Jobs

| Job | Frequency | Description |
| -- | -- | -- |
| Population | 5 min | Update the population for any democracy that has had new or updated memberships. Communicates with the membership service. |
