import { useState } from "react";
import {
	CommandLineIcon,
	ArrowTurnDownLeftIcon,
} from "@heroicons/react/24/solid";

function RawQueryExec() {
	const [rawQuery, setRawQuery] = useState<string>("");

	const execQuery = () => {
		console.log("execQuery", rawQuery);
		// TODO
	};

	return (
		<div className='flex  items-center justify-center h-56 w-screen fixed bg-black'>
			<input
				className='my-2 p-2 rounded-md text-lime-600 items-center text-center w-64 focus:w-screen h-10 transition-all duration-500 ease-in-out'
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
			<button className='flex items-center bg-slate-700 p-2 ml-2 rounded-md'>
				<ArrowTurnDownLeftIcon className='w-6 h-6' />
				<span className='ml-2 text-nowrap'> Exec Query</span>
			</button>
		</div>
	);
}

export { RawQueryExec };
