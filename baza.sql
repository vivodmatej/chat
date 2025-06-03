--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

-- Started on 2025-06-03 08:18:54

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 6 (class 2615 OID 16389)
-- Name: chat; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA chat;


ALTER SCHEMA chat OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 221 (class 1259 OID 16453)
-- Name: message; Type: TABLE; Schema: chat; Owner: postgres
--

CREATE TABLE chat.message (
    id integer NOT NULL,
    text text NOT NULL,
    "userId" integer NOT NULL,
    date integer NOT NULL,
    likes jsonb[]
);


ALTER TABLE chat.message OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16452)
-- Name: message_id_seq; Type: SEQUENCE; Schema: chat; Owner: postgres
--

CREATE SEQUENCE chat.message_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE chat.message_id_seq OWNER TO postgres;

--
-- TOC entry 4808 (class 0 OID 0)
-- Dependencies: 220
-- Name: message_id_seq; Type: SEQUENCE OWNED BY; Schema: chat; Owner: postgres
--

ALTER SEQUENCE chat.message_id_seq OWNED BY chat.message.id;


--
-- TOC entry 219 (class 1259 OID 16444)
-- Name: user; Type: TABLE; Schema: chat; Owner: postgres
--

CREATE TABLE chat."user" (
    id integer NOT NULL,
    name text NOT NULL
);


ALTER TABLE chat."user" OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 16443)
-- Name: user_id_seq; Type: SEQUENCE; Schema: chat; Owner: postgres
--

CREATE SEQUENCE chat.user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE chat.user_id_seq OWNER TO postgres;

--
-- TOC entry 4809 (class 0 OID 0)
-- Dependencies: 218
-- Name: user_id_seq; Type: SEQUENCE OWNED BY; Schema: chat; Owner: postgres
--

ALTER SEQUENCE chat.user_id_seq OWNED BY chat."user".id;


--
-- TOC entry 4648 (class 2604 OID 16456)
-- Name: message id; Type: DEFAULT; Schema: chat; Owner: postgres
--

ALTER TABLE ONLY chat.message ALTER COLUMN id SET DEFAULT nextval('chat.message_id_seq'::regclass);


--
-- TOC entry 4647 (class 2604 OID 16447)
-- Name: user id; Type: DEFAULT; Schema: chat; Owner: postgres
--

ALTER TABLE ONLY chat."user" ALTER COLUMN id SET DEFAULT nextval('chat.user_id_seq'::regclass);


--
-- TOC entry 4802 (class 0 OID 16453)
-- Dependencies: 221
-- Data for Name: message; Type: TABLE DATA; Schema: chat; Owner: postgres
--

COPY chat.message (id, text, "userId", date, likes) FROM stdin;
148	Zdravo	26	1748931388	{"{\\"type\\": \\"like\\", \\"userId\\": 15, \\"username\\": \\"Matej\\"}"}
149	Zdravo	27	1748931449	{}
130	Zdravo	18	1748930695	{}
131	Zdravo	19	1748930732	{}
132	Zdravo	21	1748930980	{}
134	Zdravo	20	1748931095	{}
133	Test	15	1748930985	{"{\\"type\\": \\"dislike\\", \\"userId\\": 21, \\"username\\": \\"Sanja\\"}","{\\"type\\": \\"dislike\\", \\"userId\\": 16, \\"username\\": \\"Janez\\"}","{\\"type\\": \\"dislike\\", \\"userId\\": 22, \\"username\\": \\"Mriko\\"}","{\\"type\\": \\"dislike\\", \\"userId\\": 20, \\"username\\": \\"Ana\\"}","{\\"type\\": \\"dislike\\", \\"userId\\": 19, \\"username\\": \\"Luka\\"}"}
135	1	15	1748931122	{}
136	2	15	1748931122	{}
137	3	15	1748931124	{}
138	4	15	1748931125	{}
139	5	15	1748931126	{}
140	6	15	1748931127	{}
141	7	15	1748931127	{}
142	8	15	1748931129	{}
143	9	15	1748931131	{}
144	10	15	1748931133	{}
145	Zdravo	24	1748931175	{}
146	Ponovno lahko pošiljam sporočila	15	1748931188	{}
147	Test	15	1748931208	{}
127	Zdravo	15	1748930582	{"{\\"type\\": \\"like\\", \\"userId\\": 17, \\"username\\": \\"Mirko\\"}","{\\"type\\": \\"like\\", \\"userId\\": 16, \\"username\\": \\"Janez\\"}","{\\"type\\": \\"like\\", \\"userId\\": 18, \\"username\\": \\"David\\"}","{\\"type\\": \\"like\\", \\"userId\\": 20, \\"username\\": \\"Ana\\"}","{\\"type\\": \\"like\\", \\"userId\\": 21, \\"username\\": \\"Sanja\\"}","{\\"type\\": \\"like\\", \\"userId\\": 26, \\"username\\": \\"Sonja\\"}"}
128	Zdravo	16	1748930587	{"{\\"type\\": \\"like\\", \\"userId\\": 15, \\"username\\": \\"Matej\\"}","{\\"type\\": \\"like\\", \\"userId\\": 26, \\"username\\": \\"Sonja\\"}"}
129	Zdravo	17	1748930600	{"{\\"type\\": \\"like\\", \\"userId\\": 15, \\"username\\": \\"Matej\\"}","{\\"type\\": \\"like\\", \\"userId\\": 16, \\"username\\": \\"Janez\\"}","{\\"type\\": \\"like\\", \\"userId\\": 26, \\"username\\": \\"Sonja\\"}"}
\.


--
-- TOC entry 4800 (class 0 OID 16444)
-- Dependencies: 219
-- Data for Name: user; Type: TABLE DATA; Schema: chat; Owner: postgres
--

COPY chat."user" (id, name) FROM stdin;
15	Matej
16	Janez
17	Mirko
18	David
19	Luka
20	Ana
21	Sanja
22	Mriko
23	Janja
24	Andrej
26	Sonja
27	Jan
\.


--
-- TOC entry 4810 (class 0 OID 0)
-- Dependencies: 220
-- Name: message_id_seq; Type: SEQUENCE SET; Schema: chat; Owner: postgres
--

SELECT pg_catalog.setval('chat.message_id_seq', 149, true);


--
-- TOC entry 4811 (class 0 OID 0)
-- Dependencies: 218
-- Name: user_id_seq; Type: SEQUENCE SET; Schema: chat; Owner: postgres
--

SELECT pg_catalog.setval('chat.user_id_seq', 27, true);


--
-- TOC entry 4652 (class 2606 OID 16460)
-- Name: message message_pkey; Type: CONSTRAINT; Schema: chat; Owner: postgres
--

ALTER TABLE ONLY chat.message
    ADD CONSTRAINT message_pkey PRIMARY KEY (id);


--
-- TOC entry 4650 (class 2606 OID 16451)
-- Name: user user_pkey; Type: CONSTRAINT; Schema: chat; Owner: postgres
--

ALTER TABLE ONLY chat."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- TOC entry 4653 (class 2606 OID 16461)
-- Name: message fk_user; Type: FK CONSTRAINT; Schema: chat; Owner: postgres
--

ALTER TABLE ONLY chat.message
    ADD CONSTRAINT fk_user FOREIGN KEY ("userId") REFERENCES chat."user"(id);


-- Completed on 2025-06-03 08:18:55

--
-- PostgreSQL database dump complete
--

