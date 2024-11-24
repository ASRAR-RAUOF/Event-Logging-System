
# Event Logging System

A scalable backend system providing a decentralized, tamper-proof event logging platform for distributed applications.


## Features

- Event Logging API: 
RESTful API to receive and store event logs.

- Event metadata includes:
Event Type
Timestamp
Source Application ID
Data Payload (JSON)

- Tamper-Proof Design:
Cryptographic hashing to link logs in a lightweight, blockchain-inspired chain.
Each log references the hash of the previous log.

- Search and Query
Query logs by timestamp range, event type, or source application.
Supports pagination for large datasets.

- Error Handling and Validation:
Schema validation for incoming data.
Comprehensive error handling for invalid data or missing fields.

- Bonus Features
Visualization dashboard to monitor logs.


## Run Locally

Clone the project

```bash
  git clone <repository_url>  


```

Go to the project directory

```bash
  cd Event-Logging-System  
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start/node app.js  
```

Open browser and visit

```bash
http://localhost:3000  
```


## Video Demo
https://github.com/user-attachments/assets/3fdb4d94-f8de-450a-a3e7-6f7b3e9dcb48

