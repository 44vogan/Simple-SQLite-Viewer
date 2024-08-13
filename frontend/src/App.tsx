// TODO how to make exec query?

import { useEffect, useState } from "react";
import { OnFileDrop } from "../wailsjs/runtime/runtime";
import "./App.css";
import { CircleStackIcon, CommandLineIcon } from "@heroicons/react/24/solid";
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
import {
	useSelectedTableStore,
	useglobalRowLimit,
	useGlobalShowQueryExec,
} from "./Store";
import { Limit } from "./Limit";
import { RawQueryExec } from "./RawQueryExec";

function App() {
	const [filePath, setFilePath] = useState<string>("");
	const [tableNames, setTableNames] = useState<string[]>([]);
	const [columns, setColumns] = useState<Columns[]>([]);
	const { selectedTable, setSelectedTable } = useSelectedTableStore();
	const { globalRowLimit, setGlobalRowLimit } = useglobalRowLimit();
	const [tableData, setTableData] = useState<TableData<any>>([]);
	const { globalShowQueryExec, setGlobalShowQueryExec } =
		useGlobalShowQueryExec();
	useEffect(() => {
		// listen to drag and drop events
		OnFileDrop((x, y, file) => {
			console.log(file[0]);
			if (file[0].endsWith(".db")) {
				setFilePath(() => file[0]);
			} else {
				// ShowWrongFileTypeMessage();
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
		console.log("[selectedTable,globalRowLimit] effect");
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
				globalRowLimit
			);
			if (res.status === "ok" && res.data) {
				console.log("got table data ->", res.data);
				setTableData(res.data);
			} else {
				setTableData([]);
			}
		};

		let timer: any;
		if (tableNames.includes(selectedTable)) {
			timer = setTimeout(() => {
				getTableInfo();
				getTableData();
			}, 100);
		} else {
			setColumns([]);
			setTableData([]);
		}
		return () => {
			clearTimeout(timer);
			console.log("[selectedTable,globalRowLimit] cleanup");
		};
	}, [selectedTable, globalRowLimit]);

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
			className='dropable box-border inset-0 h-screen w-screen max-w-full  flex flex-col items-center justify-start px-3'
		>
			<div
				onClick={() => openFile()}
				className={`flex items-center box-border mt-1 p-2 px-5 rounded-md bg-slate-800 w-fit cursor-pointer transition-all ${
					filePath === "" ? "translate-y-48" : "translate-y-0"
				}`}
			>
				<CircleStackIcon className='w-5 h-5 mr-2' />
				<span>
					{filePath === "" ? "drop or click to open  a .db file" : filePath}
				</span>
			</div>

			{filePath && (
				<div className='flex flex-col items-center justify-start'>
					<div className='flex items-center justify-between'>
						<Limit />
						<TableNames tableNames={tableNames} />
					</div>
					<Table columns={columns} tableData={tableData} />
				</div>
			)}
			{filePath && (
				<CommandLineIcon
					title='Execute Query'
					className='w-9 h-9 mr-2 fixed top-5 right-5 cursor-pointer transition duration-500 ease-in-out opacity-80 hover:opacity-100'
					onClick={() => setGlobalShowQueryExec(!globalShowQueryExec)}
				/>
			)}
			{filePath && globalShowQueryExec && <RawQueryExec filePath={filePath} />}
		</div>
	);
}

export default App;
