// TODO test

import { useEffect, useState } from "react";
import { OnFileDrop } from "../wailsjs/runtime/runtime";
import "./App.css";
import {
	GetTableNames,
	ShowWrongFileTypeMessage,
	GetTableInfo,
	OpenFile,
	GetTableData,
} from "../wailsjs/go/main/App";
import TableNames from "./TableNames";
import Table from "./Table";
import { Columns, TableData } from "./types";
import { useSelectedTableStore } from "./Store";

function App() {
	const [filePath, setFilePath] = useState<string>("");
	const [tableNames, setTableNames] = useState<string[]>([]);
	const [columns, setColumns] = useState<Columns[]>([]);
	const { selectedTable, setSelectedTable } = useSelectedTableStore();
	const [tableData, setTableData] = useState<TableData<any>>([]);

	useEffect(() => {
		// listen to drag and drop events
		OnFileDrop((x, y, file) => {
			console.log(file[0]);
			if (file[0].endsWith(".db")) {
				setFilePath(() => file[0]);
			} else {
				ShowWrongFileTypeMessage();
			}
		}, true);
	}, []);

	useEffect(() => {
		const getTableNames = async () => {
			let res: { status: string; tables: string[] } = await GetTableNames(
				filePath
			);
			if (res.status === "ok" && res.tables) {
				console.log("got table names ->", res.tables);
				setTableNames(res.tables);
			} else {
				setTableNames([]);
			}
		};

		getTableNames();
		setSelectedTable("");
		setColumns([]);
	}, [filePath]);

	useEffect(() => {
		const getTableInfo = async () => {
			let res: { status: string; columns: Columns[] } = await GetTableInfo(
				filePath,
				selectedTable
			);
			if (res.status === "ok" && res.columns.length > 0) {
				console.log("got table info ->", res.columns);
				setColumns(res.columns);
			} else {
				setColumns([]);
			}
		};

		const getTableData = async () => {
			let res: { status: string; data: any[] } = await GetTableData(
				filePath,
				selectedTable,
				100
			);
			if (res.status === "ok" && res.data) {
				console.log("got table data ->", res.data);
				setTableData(res.data);
			} else {
				setTableData([]);
			}
		};

		if (tableNames.includes(selectedTable)) {
			getTableInfo();
			getTableData();
		} else {
			setColumns([]);
			setTableData([]);
		}
	}, [selectedTable]);

	const openFile = async () => {
		const res = await OpenFile();
		console.log("openFile res ->", res);
		if (res.status !== "ok" || !res.path.endsWith(".db")) {
			return;
		}
		setFilePath(res.path);
	};

	return (
		<div
			id='App'
			className='dropable box-border inset-0 h-screen w-screen max-w-full  flex flex-col items-center justify-start'
		>
			<div
				onClick={() => openFile()}
				className={`box-border mt-1 p-2 px-5 rounded-md bg-slate-400 w-fit cursor-pointer transition-all ${
					filePath === "" ? "translate-y-40" : ""
				}`}
			>
				{filePath === "" ? "drop or click to open  a .db file" : filePath}
			</div>
			{filePath && (
				<div className='flex flex-col items-center justify-start'>
					<TableNames tableNames={tableNames} />
					<Table columns={columns} tableData={tableData} />
				</div>
			)}
		</div>
	);
}

export default App;
