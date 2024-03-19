"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.AppDataSource = void 0;
var dotenv = require("dotenv");
dotenv.config();
var role_entity_1 = require("./src/roles/entities/role.entity");
var typeorm_1 = require("typeorm");
var employee_entity_1 = require("./src/employees/entities/employee.entity");
var getAllUsers = function () { return __awaiter(void 0, void 0, void 0, function () {
    var response, data, employees;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fetch("https://randomuser.me/api?page=1&results=20&seed=abc")];
            case 1:
                response = _a.sent();
                return [4 /*yield*/, response.json()];
            case 2:
                data = _a.sent();
                employees = data.results.map(function (u) { return ({
                    fullName: u.name.first + " " + u.name.last,
                    email: u.email,
                    phone: u.phone,
                    gender: u.gender === "female" ? "F" : "M",
                    birthDate: u.dob.date,
                    hireDate: u.registered.date,
                    photo: u.picture.large
                }); });
                return [2 /*return*/, employees];
        }
    });
}); };
var data = [
    {
        name: "CEO",
        description: "Chief Executive Officer (CEO) creates the mission and purpose statements and sets the standards for business operations"
    },
    {
        name: "CTO",
        reportsTo: "CEO",
        description: "Chief Technology Officer(CTO) manages the physical and personnel technology infrastructure including technology deployment, network and system management, integration testing, and developing technical operations personnel"
    },
    {
        name: "CFO",
        reportsTo: "CEO",
        description: "Chief Financial Officer(CFO) is responsible for managing the company's financial operations and strategy"
    },
    {
        name: "COO",
        reportsTo: "CEO",
        description: "Chief Operating Officer(COO) oversees day-to-day operations and executes the company's long-term goals"
    },
    {
        name: "HR",
        reportsTo: "CEO",
        description: "Human resources (HR) is responsible for finding, recruiting, screening, and training job applicants business responsible for finding, recruiting, screening, and training job applicants"
    },
    {
        name: "Project Manager",
        reportsTo: "CTO",
        description: "Project Manager is organizes, plans, and executes projects while working within constraints like budgets and schedules."
    },
    {
        name: "Product Owner",
        reportsTo: "Project Manager",
        description: "The project owner is typically the head of the business unit that proposed the project or is the recipient of the project output or product."
    },
    {
        name: "Tech Lead",
        reportsTo: "Product Owner",
        description: "A technical lead is a professional who oversees a team of technical personnel at a software or technology company"
    },
    {
        name: "Frontend Developer",
        reportsTo: "Tech Lead",
        description: "A front-end developer builds the front-end portion of websites and web applications—the part users see and interact with"
    },
    {
        name: "Backend Developer",
        reportsTo: "Tech Lead",
        description: "Back-end developers are the experts who build and maintain the mechanisms that process data and perform actions on websites"
    },
    {
        name: "DevOps Developer",
        reportsTo: "Tech Lead",
        description: "A DevOps engineer works with both the development and operations teams to create and implement software systems"
    },
    {
        name: "QA Engineer",
        reportsTo: "Product Owner",
        description: "A QA engineer creates tests that identify issues with software before a product launch."
    },
    {
        name: "Scrum Master",
        reportsTo: "Product Owner",
        description: "A Scrum Master is a professional who leads a team using Agile project management through the course of a project"
    },
    {
        name: "Chief Accountant",
        reportsTo: "CFO",
        description: "Contribute to the preparation of the annual revenue and capital budgets, monitoring of financial performance and completion of the annual accounts."
    },
    {
        name: "Internal Audit",
        reportsTo: "CFO",
        description: "Internal auditors examine and analyze company records and financial documents"
    },
    {
        name: "Financial Analyst",
        reportsTo: "Chief Accountant",
        description: "Financial analysts are responsible for a variety of research tasks to inform investment strategy and make investment decisions for their company or clients"
    },
    {
        name: "Product Manger",
        reportsTo: "COO",
        description: "A project manager is a professional who organizes, plans, and executes projects while working within restraints like budgets and schedules"
    },
    {
        name: "Operation Manger",
        reportsTo: "COO",
        description: "An operations manager is responsible for implementing and maintaining the processes that an organization uses"
    },
    {
        name: "Customer Relation",
        reportsTo: "COO",
        description: "Customer Relation handle the concerns of the people who buy their company's products or services"
    },
];
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: process.env["HOST"] || "localhost",
    port: Number(process.env["PORT"]) || 5432,
    username: process.env["DB_USERNAME"],
    password: process.env["PASSWORD"],
    database: process.env["DATABASE"] || "orga_structure",
    synchronize: true,
    logging: true,
    entities: [role_entity_1.Role, employee_entity_1.Employee]
});
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var employees, i, r, e, reportsTo, role, newRole, employee;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, exports.AppDataSource.initialize()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, exports.AppDataSource.manager["delete"](employee_entity_1.Employee, {})];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, exports.AppDataSource.manager["delete"](role_entity_1.Role, {})];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, getAllUsers()];
                case 4:
                    employees = _a.sent();
                    i = 0;
                    _a.label = 5;
                case 5:
                    if (!(i < data.length)) return [3 /*break*/, 11];
                    r = data[i];
                    e = employees[i];
                    reportsTo = void 0;
                    if (!r.reportsTo) return [3 /*break*/, 7];
                    return [4 /*yield*/, exports.AppDataSource.manager.findOneBy(role_entity_1.Role, {
                            name: r.reportsTo
                        })];
                case 6:
                    reportsTo = _a.sent();
                    _a.label = 7;
                case 7:
                    role = exports.AppDataSource.manager.create(role_entity_1.Role, __assign(__assign({}, r), { reportsTo: reportsTo }));
                    return [4 /*yield*/, exports.AppDataSource.manager.save(role)];
                case 8:
                    newRole = _a.sent();
                    employee = exports.AppDataSource.manager.create(employee_entity_1.Employee, __assign(__assign({}, e), { role: newRole }));
                    return [4 /*yield*/, exports.AppDataSource.manager.save(employee)];
                case 9:
                    _a.sent();
                    _a.label = 10;
                case 10:
                    i++;
                    return [3 /*break*/, 5];
                case 11:
                    console.log("finished generating and saving test data");
                    return [2 /*return*/];
            }
        });
    });
}
main();
