const fs = require('fs');
const url = require('url');
const http = require('http');
const port = 9000;

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    if (pathname === '/' && req.method === "GET") {
        res.setHeader("Content-Type", "text/html");
        let data = fs.readFileSync("./crud/home.html", "utf-8");
        res.end(data);
    }
    else if (pathname === '/addusr' && req.method === "GET") {
        res.setHeader("Content-Type", "text/html");
        let data = fs.readFileSync("./crud/addusr.html", "utf-8");
        res.end(data);
    }
    else if (pathname === '/dltusr' && req.method === "GET") {
        res.setHeader("Content-Type", "text/html");
        let data = fs.readFileSync("./crud/dltusr.html", "utf-8");
        res.end(data);
    }
    else if (pathname === '/disp' && req.method === "GET") {
        res.setHeader("Content-Type", "text/html");
        let data = fs.readFileSync("./crud/disp.html", "utf-8");
        res.end(data);
    }
    else if (pathname === '/updusr' && req.method === "GET") {
        res.setHeader("Content-Type", "text/html");
        let data = fs.readFileSync("./crud/updusr.html", "utf-8");
        res.end(data);
    }
    else if (pathname === '/addusr' && req.method === "POST") {
        let body = "";
        req.on("data", (chunks) => {
            body += chunks;
        });
        req.on("end", () => {
            let data1 = JSON.parse(body);
            let file = [];
            try {
                file = JSON.parse(fs.readFileSync("./manage.json", "utf-8"));
            } catch (err) {}
            
            let obj = {
                id: `${data1.id}`,
                name: `${data1.name}`,
                course: `${data1.course}`,
                email: `${data1.email}`,
                password: `${data1.paswd}`,
                address: `${data1.address}`
            };
            file.push(obj);
            try {
                fs.writeFileSync("./manage.json", JSON.stringify(file), "utf-8");
                res.writeHead(202, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ message: "Data Entered successfully!", status: "success" }));
            } catch (err) {
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ message: "Error while entering user!" }));
            }
        });
    }
    else if (pathname === '/updusr' && req.method === "PUT") {
        let body = "";
        req.on("data", (chunks) => {
            body += chunks;
        });
        req.on("end", () => {
            let data1 = JSON.parse(body);
            let file = [];
            try {
                file = JSON.parse(fs.readFileSync("./manage.json", "utf-8"));
            } catch (err) {}

            let index = file.findIndex(ob => ob.id == data1.id);
            if (index !== -1) {
                file[index] = { ...data1 };
                fs.writeFileSync("./manage.json", JSON.stringify(file), "utf-8");
                res.writeHead(202, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ message: "Data updated successfully!", status: "success" }));
            } else {
                res.writeHead(404, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ message: "User not found!" }));
            }
        });
    }
    else if (pathname === '/dltusr' && req.method === "DELETE") {
        let body = "";
        req.on("data", (chunks) => {
            body += chunks;
        });
        req.on("end", () => {
            let data = JSON.parse(body);
            let file = [];
            try {
                file = JSON.parse(fs.readFileSync("./manage.json", "utf-8"));
            } catch (err) {
                res.writeHead(404, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ message: "Database is empty!" }));
                return;
            }
            let index = file.findIndex(ob => ob.id === data.id && ob.password === data.paswd);
            if (index !== -1) {
                file.splice(index, 1);
                fs.writeFileSync("./manage.json", JSON.stringify(file), "utf-8");
                res.writeHead(202, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ message: "Data deleted successfully!" }));
            } else {
                res.writeHead(404, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ message: "Invalid credentials!" }));
            }
        });
    }
    else if (pathname.startsWith('/disp/') && req.method === "GET") {
        // Display single user by id and password
        const parts = pathname.split('/');
        const id = parts[2];
        const password = parts[3];

        let file = [];
        try {
            file = JSON.parse(fs.readFileSync("./manage.json", "utf-8"));
        } catch (err) {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Database is empty" }));
            return;
        }

        let user = file.find(ob => ob.id === id && ob.password === password);
        if (user) {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(user));
        } else {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Invalid credentials" }));
        }
    }
    else if (pathname === '/dispall' && req.method === "GET") {
        // Display all users
        let file = [];
        try {
            file = JSON.parse(fs.readFileSync("./manage.json", "utf-8"));
        } catch (err) {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Database is empty" }));
            return;
        }
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(file));
    }
    else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Route not found");
    }
});

server.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
