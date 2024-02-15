var mysql = require('mysql');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var urlEncodedParser = bodyParser.urlencoded({ extended: true });
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var con = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: ""
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");

    con.query("CREATE DATABASE IF NOT EXISTS Company", function (err, result) {
        if (err) throw err;
        console.log("Database created");
    });

    con.query("USE Company", function (err, result) {
        if (err) throw err;
        console.log("Using Company database");
    });

    var employees = "CREATE TABLE IF NOT EXISTS employees (ssn int(3) PRIMARY KEY, fname char(30), minit char(30), lname char(30), bdate date, address varchar(30), sex char(30), salary decimal(10,2), super_ssn int(3), dno int(3))";
    con.query(employees, function (err, result) {
        if (err) throw err;
        console.log("Table EMPLOYEES created");
    });

    var departments = "CREATE TABLE IF NOT EXISTS departments (dname varchar(30), dnumber int(3) PRIMARY KEY, mgr_ssn int(3), mgr_start_date date)";
    con.query(departments, function (err, result) {
        if (err) throw err;
        console.log("Table DEPARTMENTS created");
    });

    var department_location = "CREATE TABLE IF NOT EXISTS department_location (dnumber int(3), dlocation varchar(30), PRIMARY KEY (dnumber, dlocation), FOREIGN KEY (dnumber) REFERENCES departments(dnumber))";
    con.query(department_location, function (err, result) {
        if (err) throw err;
        console.log("Table DEPARTMENT_LOCATION created");
    });

    var projects = "CREATE TABLE IF NOT EXISTS projects (pname varchar(30), pnumber int(3) PRIMARY KEY, plocation varchar(30), dnum int(3), FOREIGN KEY (dnum) REFERENCES departments(dnumber))";
    con.query(projects, function (err, result) {
        if (err) throw err;
        console.log("Table PROJECTS created");
    });

    var worksOn = "CREATE TABLE IF NOT EXISTS worksOn (essn int(3) PRIMARY KEY, pno int(3), hours decimal(10,2), FOREIGN KEY (pno) REFERENCES projects(pnumber))";
    con.query(worksOn, function (err, result) {
        if (err) throw err;
        console.log("Table WORKS_ON created");
    });

    var dependents = "CREATE TABLE IF NOT EXISTS dependents (essn int(3), dependent_name varchar(30) PRIMARY KEY, sex char(30), bdate date, relationship varchar(30), FOREIGN KEY (essn) REFERENCES worksOn(essn))";
    con.query(dependents, function (err, result) {
        if (err) throw err;
        console.log("Table DEPENDENTS created");
    });

    

});

app.get('/', (req, res) => {
    
    res.send(`
    
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Employee Operations</title>
    <style>
        body {
    width: 100%;
    height: 100vh;
    margin: 0;
    background-color: #1b1b32;
    color: #f5f6f7;
    font-family: Tahoma;
    font-size: 16px;
  }
  
  h1, p {
    margin: 1em auto;
    text-align: center;
  }
  
  form {
    width: 60vw;
    max-width: 500px;
    min-width: 300px;
    margin: 0 auto;
    padding-bottom: 2em;
  }
  
  
  
  label {
    display: block;
    margin: 0.5rem 0;
  }
  
  input,
  textarea,
  select {
    margin: 10px 0 0 0;
    width: 100%;
    min-height: 2em;
  }
  
  input, textarea {
    background-color: #0a0a23;
    border: 1px solid #0a0a23;
    color: #ffffff;
  }
  
  .inline {
    width: unset;
    margin: 0 0.5em 0 0;
    vertical-align: middle;
  }
  
  input[type="submit"] {
    display: block;
    width: 60%;
    margin: 1em auto;
    height: 2em;
    font-size: 1.1rem;
    background-color: #3b3b4f;
    border-color: white;
    min-width: 300px;
  }
  
  input[type="file"] {
    padding: 1px 2px;
  }
    </style>
</head>

<body>
    <div>
        <center><h2>Fin Express</h2></center>
        <form action="/employees/insert" method="post">
            <label for="fname">First Name:</label> <input type="text" name="fname" value="" id="fname"><br><br>

            <label for="minit">Middle Initial:</label> <input type="text" name="minit" value="" id="minit"><br><br>

            <label for="lname">Last Name:</label> <input type="text" name="lname" value="" id="lname"><br><br>

            <label for="ssn">SSN:</label> <input type="text" name="ssn" value="" id="ssn"><br><br>

            <label for="bdate">Birthdate:</label> <input type="date" name="bdate" value="" id="bdate"><br><br>

            <label for="address">Address:</label> <input type="text" name="address" value="" id="address"><br><br>

            <label for="sex">Sex:</label> <input type="text" name="sex" value="" id="sex"><br><br>

            <label for="salary">Salary:</label> <input type="number" name="salary" value="" id="salary"><br><br>

            <label for="super_ssn">Super SSN:</label> <input type="text" name="super_ssn" value="" id="super_ssn"><br><br>

            <label for="dno">Department Number:</label> <input type="number" name="dno" value="" id="dno"><br><br>

            <div>
                <input type="submit" value="Add Employee">
            </div>
        </form>
    </div>

    <hr>

    <center><h2>Queries</h2></center>
    <div>
        <form action="/avgsal" method="get">
        Number of employees whose average salary is more than Rs.40000? <input type="submit" value="Find out!!">
        </form>
    </div>


    <div>
        <form action="/fememp" method="get">
        Number of female employees in each department making more than Rs 40,000? <input type="submit" value="Find out!!">
        </form>
    </div>


    <div>
        <form action="/highsal" method="get">
        Name of employees with the highest salaries in each department? <input type="submit" value="Find out!!">
        </form>
    </div>


    <div>
        <form action="/empname" method="get">
        Employees who make at least Rs 20,000 more than the employee who is paid the least in the company? <input type="submit" value="Find out!!">
        </form>
    </div>


    <div>
        <form action="/nodep" method="get">
        Employees who have no dependents? <input type="submit" value="Find out!!">
        </form>
    </div>


    <div>
        <form action="/overtime" method="get">
        Employees in department who work overtime every month? <input type="submit" value="Find out!!">
        </form>
    </div>

</body>

</html>
    
      `);
    
    });

    app.post('/employees/insert', (req, res) => {
        const { ssn, fname, minit, lname, bdate, address, sex, salary, super_ssn, dno } = req.body;
        const query = "INSERT INTO employees (ssn, fname, minit, lname, bdate, address, sex, salary, super_ssn, dno) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        con.query(query, [ssn, fname, minit, lname, bdate, address, sex, salary, super_ssn, dno], (err, result) => {
          if (err) {
            console.error(err);
            res.status(500).send("Error adding user.");
          } else {
            res.send("Employee added successfully!");
          }
        });
      });

      app.get('/avgsal', (req, res) => {
        const query = `
        SELECT D.dname, COUNT( E.ssn ) AS NumEmployees
        FROM departments D
        JOIN employees E ON D.dnumber = E.dno
        GROUP BY D.dname
        HAVING AVG( E.salary ) >40000
        `;
        con.query(query, (err, result) => {
          if (err) {
            console.error(err);
            res.status(500).send("Error in retrieving the salaries above average.");
          } else {
            res.json(result);
          }
        });
      });


      app.get('/fememp', (req, res) => {
        const query = `
        SELECT D.dname, COUNT(E.ssn) AS NumFemaleEmployees
        FROM departments D
        JOIN employees E ON D.dnumber = E.dno
        WHERE E.sex = 'F' AND E.salary > 40000
        GROUP BY D.dname;
        `;
        con.query(query, (err, result) => {
          if (err) {
            console.error(err);
            res.status(500).send("Error in retrieving female employees.");
          } else {
            res.json(result);
          }
        });
      });


      app.get('/highsal', (req, res) => {
        const query = `
        SELECT e1.fname, e1.lname 
        FROM employees e1 
        WHERE e1.dno IN (
            SELECT e2.dno 
            FROM employees e2 
            ORDER BY e2.salary DESC 
            LIMIT 1
        );
    );
        `;
        con.query(query, (err, result) => {
          if (err) {
            console.error(err);
            res.status(500).send("Error in retrieving the employee with the highest salary");
          } else {
            res.json(result);
          }
        });
      });


      app.get('/empname', (req, res) => {
        const query = `
        SELECT E.fname, E.lname
        FROM employees E
        WHERE E.salary >= (SELECT MIN(salary) + 20000 FROM employees);
        `;
        con.query(query, (err, result) => {
          if (err) {
            console.error(err);
            res.status(500).send("Error in retrieving employee names.");
          } else {
            res.json(result);
          }
        });
      });


      app.get('/nodep', (req, res) => {
        const query = `
        SELECT fname, lname
        FROM employees
        WHERE ssn NOT IN (SELECT essn FROM dependents);
        `;
        con.query(query, (err, result) => {
          if (err) {
            console.error(err);
            res.status(500).send("Error in retrieving the names of employees who have no dependents.");
          } else {
            res.json(result);
          }
        });
      });


      app.get('/overtime', (req, res) => {
        const query = `
        SELECT DISTINCT E.fname, E.lname
        FROM employees E
        JOIN worksOn W ON E.ssn = W.essn
        WHERE W.hours > 30;
        `;
        con.query(query, (err, result) => {
          if (err) {
            console.error(err);
            res.status(500).send("Error in retrieving the names of employees who work overtime.");
          } else {
            res.json(result);
          }
        });
      });

      app.listen(9909, () => {
        console.log('Server is running on port 9909');
    });



