--
-- PostgreSQL database dump
--

-- Dumped from database version 15.3 (Ubuntu 15.3-1.pgdg22.04+1)
-- Dumped by pg_dump version 15.3 (Ubuntu 15.3-1.pgdg22.04+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: employee_gender_enum; Type: TYPE; Schema: public; Owner: org_user
--

CREATE TYPE public.employee_gender_enum AS ENUM (
    'M',
    'F'
);


ALTER TYPE public.employee_gender_enum OWNER TO org_user;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: employee; Type: TABLE; Schema: public; Owner: org_user
--

CREATE TABLE public.employee (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "firstName" character varying NOT NULL,
    "lastName" character varying NOT NULL,
    gender public.employee_gender_enum NOT NULL,
    "birthDate" date NOT NULL,
    "hireDate" date NOT NULL,
    "roleId" uuid,
    photo character varying
);


ALTER TABLE public.employee OWNER TO org_user;

--
-- Name: role; Type: TABLE; Schema: public; Owner: org_user
--

CREATE TABLE public.role (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    mpath character varying DEFAULT ''::character varying,
    "reportsToId" uuid,
    "employeesId" uuid
);


ALTER TABLE public.role OWNER TO org_user;

--
-- Data for Name: employee; Type: TABLE DATA; Schema: public; Owner: org_user
--

COPY public.employee (id, "firstName", "lastName", gender, "birthDate", "hireDate", "roleId", photo) FROM stdin;
bc248988-2b89-426b-a1cc-616575d23fa1	Abebe	Tesfu	M	2000-03-05	2020-07-05	fc619034-ee3f-41bd-a056-65db041b33f0	\N
\.


--
-- Data for Name: role; Type: TABLE DATA; Schema: public; Owner: org_user
--

COPY public.role (id, name, description, mpath, "reportsToId", "employeesId") FROM stdin;
fc619034-ee3f-41bd-a056-65db041b33f0	CEO	Chief Executive Officer (CEO) creates the mission and purpose statements and sets the standards for business operations	fc619034-ee3f-41bd-a056-65db041b33f0.	\N	\N
40647cab-1a21-4af9-92ff-996a0e59508f	CTO	Chief Technology Officer(CTO) manages the physical and personnel technology infrastructure including technology deployment, network and system management, integration testing, and developing technical operations personnel	fc619034-ee3f-41bd-a056-65db041b33f0.40647cab-1a21-4af9-92ff-996a0e59508f.	fc619034-ee3f-41bd-a056-65db041b33f0	\N
5a1e57b9-941b-46f7-8950-2d4552c825b5	CFO	Chief Financial Officer(CFO) is responsible for managing the company's financial operations and strategy	fc619034-ee3f-41bd-a056-65db041b33f0.5a1e57b9-941b-46f7-8950-2d4552c825b5.	fc619034-ee3f-41bd-a056-65db041b33f0	\N
c01122ff-3ab4-4aa4-a717-02c42a2e28c0	COO	Chief Operating Officer(COO) oversees day-to-day operations and executes the company's long-term goals	fc619034-ee3f-41bd-a056-65db041b33f0.c01122ff-3ab4-4aa4-a717-02c42a2e28c0.	fc619034-ee3f-41bd-a056-65db041b33f0	\N
49cbac3b-9698-4464-81e3-5df9a757cfd6	HR	Human resources (HR) is responsible for finding, recruiting, screening, and training job applicants business responsible for finding, recruiting, screening, and training job applicants	fc619034-ee3f-41bd-a056-65db041b33f0.49cbac3b-9698-4464-81e3-5df9a757cfd6.	fc619034-ee3f-41bd-a056-65db041b33f0	\N
5b9d7c99-47d0-4f64-99ee-a58bca23be83	Project Manager	Project Manager is organizes, plans, and executes projects while working within constraints like budgets and schedules.	fc619034-ee3f-41bd-a056-65db041b33f0.40647cab-1a21-4af9-92ff-996a0e59508f.5b9d7c99-47d0-4f64-99ee-a58bca23be83.	40647cab-1a21-4af9-92ff-996a0e59508f	\N
02a1c10b-dc29-406b-bc11-ddf1cb1016b0	Product Owner	The project owner is typically the head of the business unit that proposed the project or is the recipient of the project output or product.	fc619034-ee3f-41bd-a056-65db041b33f0.40647cab-1a21-4af9-92ff-996a0e59508f.5b9d7c99-47d0-4f64-99ee-a58bca23be83.02a1c10b-dc29-406b-bc11-ddf1cb1016b0.	5b9d7c99-47d0-4f64-99ee-a58bca23be83	\N
\.


--
-- Name: employee PK_3c2bc72f03fd5abbbc5ac169498; Type: CONSTRAINT; Schema: public; Owner: org_user
--

ALTER TABLE ONLY public.employee
    ADD CONSTRAINT "PK_3c2bc72f03fd5abbbc5ac169498" PRIMARY KEY (id);


--
-- Name: role PK_b36bcfe02fc8de3c57a8b2391c2; Type: CONSTRAINT; Schema: public; Owner: org_user
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY (id);


--
-- Name: role FK_384d68e3c9979f3af7f8a92fb81; Type: FK CONSTRAINT; Schema: public; Owner: org_user
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT "FK_384d68e3c9979f3af7f8a92fb81" FOREIGN KEY ("reportsToId") REFERENCES public.role(id) ON DELETE CASCADE;


--
-- Name: employee FK_646b91cc56d9fd9760973b4980d; Type: FK CONSTRAINT; Schema: public; Owner: org_user
--

ALTER TABLE ONLY public.employee
    ADD CONSTRAINT "FK_646b91cc56d9fd9760973b4980d" FOREIGN KEY ("roleId") REFERENCES public.role(id);


--
-- Name: role FK_d1943a83c8e2303ac7542e96c99; Type: FK CONSTRAINT; Schema: public; Owner: org_user
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT "FK_d1943a83c8e2303ac7542e96c99" FOREIGN KEY ("employeesId") REFERENCES public.employee(id);


--
-- PostgreSQL database dump complete
--

