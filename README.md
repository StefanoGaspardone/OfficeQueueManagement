# Office Queue Management System

## Overview

The Office Queue Management System is designed to manage queues for desk services open to the public, such as post offices and medical offices. The system handles multiple counters that can process different types of services, like shipping or accounts management.

## System Components

### Counters

The office consists of a set of counters identified by numbers (e.g., Counter 1, Counter 2, etc.). Each counter can handle several types of services defined at configuration time.

### Service Types

Service type definitions include:

- **Tag name**: Identifies the service type
- **Service time**: Estimated average time needed to process that service type

A service type can be served by multiple counters.

## System Operation

### Client Flow

1. **Arrival**: Clients come to the office for a specific service type
2. **Ticket Issuance**: Upon arrival, clients specify their needed service type and receive a ticket with a unique wait list code
3. **Queue Management**: The system maintains separate queues for each service type
4. **Service**: When called, clients proceed to the assigned counter

### Queue Management

- **Unique Ticket Codes**: Each ticket has a unique code for the entire office
- **Service-Specific Queues**: Different queues are maintained for each service type
- **Daily Reset**: All queues are reset every morning
- **Queue Visibility**: The system tracks the number of people waiting for each service type

### Ticket Selection Algorithm

When an officer at a counter is ready to serve the next client, the system selects the ticket using the following rule:

> Select the first number from the **longest queue** among those corresponding to the service types the counter can handle. If two or more queues have the same length, select the queue associated with the request type having the **lowest service time**.

- If all queues the counter can serve are empty, the system does nothing
- Selected tickets are removed from their queue and considered served

## Display Board Notifications

The system provides real-time updates on the main display board:

### When a New Ticket is Issued

- Updated queue lengths are displayed
- Interested customers are notified of changes

### When a Ticket is Called

- The ticket number being called is shown
- The counter number is displayed
- Updated queue length for the served ticket type is shown

## Waiting Time Estimation

The system provides an estimate of the minimum waiting time for ticket holders using the following formula:

```
T_r = t_r · (n_r / Σ(k_i · s_i,r) + 1/2)
```

Where:

- **T_r**: Estimated waiting time for request type r
- **t_r**: Service time for request type r
- **n_r**: Number of people in queue for request type r
- **k_i**: Number of different types of requests served by counter i
- **s_i,r**: Indicator variable (1 if counter i can serve request r, 0 otherwise)

### Example Calculation

**Scenario**: John enters the post office to deposit money. There are two counters that can offer that service: one exclusively handles deposits, the other handles both deposits and package shipping. There are 4 people waiting for the same service, and the service time is 5 minutes.

**Calculation**:

```
T_r = 5 · (4 / (1 + 1/2) + 1/2)
    = 5 · (8/3 + 1/2)
    = 15:50 minutes
```

## Statistics and Reporting

The system provides comprehensive statistics for management:

### Service Statistics

- Number of customers served per service type
- Data available per day, week, and month

### Counter Statistics

- Number of customers each counter has served
- Statistics further divided by service type
- Data available per day, week, and month

---

**Version**: 2.2.0 2025-10-15
