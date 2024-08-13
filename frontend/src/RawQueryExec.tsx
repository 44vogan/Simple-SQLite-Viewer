import { useState } from "react";
import {
	CommandLineIcon,
	ArrowTurnDownLeftIcon,
	XMarkIcon,
} from "@heroicons/react/24/solid";
import { ExecQuery } from "../wailsjs/go/main/App";
import { useGlobalShowQueryExec } from "./Store";

type Props = {
	filePath: string;
};

function RawQueryExec({ filePath }: Props) {
	const [rawQuery, setRawQuery] = useState<string>("");
	const { globalShowQueryExec, setGlobalShowQueryExec } =
		useGlobalShowQueryExec();
	const [queryStatus, setQueryStatus] = useState<string>("");
	const [queyResult, setQueryResult] = useState<any[]>([]);

	const execQuery = async () => {
		console.log("execQuery", rawQuery);
		const res: { status: string; result: any[] } = await ExecQuery(
			filePath,
			rawQuery
		);
		console.log("res", res);
		setQueryStatus(res.status);
		if (res.status === "ok") {
			console.log("execQuery ok");
			setQueryResult(res.result);
		} else {
			console.log("execQuery error");
			setQueryResult([]);
		}
		// TODO
	};

	return (
		<div className='flex flex-col items-center justify-start h-screen w-screen overflow-y-scroll fixed bg-black bg-opacity-40 backdrop-blur-sm'>
			<div className='flex items-center justify-center w-11/12'>
				<input
					className='my-2 p-2 rounded-md text-lime-600 items-center text-center h-10 w-64 focus:w-screen opacity-85 focus:opacity-100 transition-all duration-500 ease-in-out'
					type='text'
					placeholder='input raw query to execute'
					value={rawQuery}
					onChange={(e) => setRawQuery(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							execQuery();
							e.currentTarget.blur();
						}
						if (e.key === "Escape") {
							console.log("Enter pressed");
							e.currentTarget.blur();
						}
					}}
				/>
				<button
					className='flex items-center bg-slate-700 transition duration-500 ease-in-out p-2  rounded-lg opacity-90  hover:opacity-100 scale-90 hover:scale-95 font-bold'
					onClick={execQuery}
				>
					<ArrowTurnDownLeftIcon className='w-8 h-8' />
					<span className='ml-2 text-nowrap font-bold'> Exec Query</span>
				</button>
			</div>
			{queryStatus && (
				<h1 className='text-3xl text-slate-100 font-bold'>
					Query Exec : {queryStatus}
				</h1>
			)}
			{queyResult && (
				<div className='flex flex-col items-left justify-left  w-9/12'>
					{queyResult.length > 0 &&
						queyResult.map((row) => (
							<p
								key={JSON.stringify(row)}
								className='w-11/12 text-left text-wrap p-2 py-4 font-semibold'
							>
								{JSON.stringify(row)}
							</p>
						))}
				</div>
			)}

			<button
				className='fixed top-5 left-5 transition opacity-50 hover:opacity-100 scale-95 hover:scale-100'
				onClick={() => setGlobalShowQueryExec(false)}
			>
				<XMarkIcon className='w-10 h-10 ml-2' />
			</button>
		</div>
	);
}

export { RawQueryExec };
