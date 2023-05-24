# Perago Test Project for Nest.js

Perago Information Systems's NestJS API project

## Getting Started

- Clone this repository
- Execute `npm install` to install required dependence will be installed.
- Create database credentials. Execute `cp .env.example .env` and populate values for each key.
- Create a database named `orga_structure`
- Execute `nest start`.
- Access and test your api via swagger <http://localhost:3000/api>

## Requirements

Build web application(API) for registering organization's employee hierarchy or structure.
> Assume medium level organization management structure with different level of positions/roles Hierarchy. At the top of the Hierarch there is CEO and every position below a given hierarchy will answer/Report to the immediate position in the organization's position structure hierarchy

1. shall create employee position/role
2. Build RESTFull API using NestJS (version >= 9) , PostgreSQL or SQL Server database as data store
3. The position should be hierarchical there is a parent child relationship between the positions e.g. CEO can be root position no parent and CFO is a child of CEO
4. shall get and list the positions in a tree mode with unlimited n positions e.g.

```text
CEO
├── CTO
│   └── Project Manager
│       └── Product Owner
│           ├── Tech Lead
│           │   ├── Frontend Developer
│           │   ├── Backend Developer
│           │   ├── DevOps Engineer
│           │   └── ..
│           ├── QA Engineer
│           ├── Scrum Master
│           └── ...
├── CFO
│   ├── Chef Accountant
│   │   ├── Financial Analyst
│   │   └── Account and Payable
│   └── Internal Audit
├── COO
│   ├── Product Manager
│   ├── Operation Manager
│   ├── Customer Relation
│   └── ...
└── HR
```

5. Model (you can update this model if needed)

| Column      | Type   |
|-------------|--------|
| id          | GUID   |
| name        | string |
| description | string |
| parentId    |GUID    |

6.
```text
  a. Insert new employee position/role
    - Every position/role must contain minimum information like Name, Description and Managing position/role to whom the position Report To etc.
  b. Update previously saved position/role at any time
  c. Get single position/role detail
  d. Get all position/role structure according to hierarchy (You can use table or tree)
  e. Get all children of a specific position/role
  f. remove  position/role  at any time based on the hierarchy
```

## Notes

- Every position/role will answer/Report to one position/role except CEO
- The client wants to add or Update management structure at any time.
- The development should consider separation of concern and maintainability.
- The development should include Unit Test for the controller.
- To test your API, use Postman or Swagger

## Reading Materials

### Books

- Patterns, Principles and Practices of Domain Driven Design (Scott Millett Nick Tune)
- Clean Architecture, A Craftsman’s Guide to Software Structure and Design, (Robert C Martin)
- DDD Reference (Domain Driven Design Reference)
- DDD Quickly (Domain Driven Design Quickly)

### Links

#### For Backend

- [Nest (NestJS)](https://docs.nestjs.com/)
- [DDD, Hexagonal, Onion, Clean, CQRS, … How I put it all together](https://herbertograca.com/2017/11/16/explicit-architecture-01-ddd-hexagonal-onion-clean-cqrs-how-i-put-it-all-together/)
- [Command Query Responsibility Segregation (CQRS) pattern](https://www.ibm.com/cloud/architecture/architectures/event-driven-cqrs-pattern/)
- [What is the CQRS pattern?](https://www.ibm.com/cloud/architecture/architectures/event-driven-cqrs-pattern/)

#### For Database

- [PostgreSQL Documentation](https://www.postgresql.org/docs/9.6/postgres-fdw.html)
- [SQL Server](https://docs.microsoft.com/en-us/sql/sql-server/?view=sql-server-ver16)
  