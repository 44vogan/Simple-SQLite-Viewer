import React from "react";
import { useglobalRowLimit } from "./Store";

function Limit() {
	const { globalRowLimit, setGlobalRowLimit } = useglobalRowLimit();

	return (
		<div className='flex items-center justify-center'>
			<span>Row Limit: </span>
			<input
				className='mx-2 p-1 rounded-md text-black items-center text-center w-24'
				placeholder='10'
				value={globalRowLimit}
				type='number'
				min={1}
				onChange={(e) => {
					let value = parseInt(e.target.value);
					if (isNaN(value)) {
						value = 10;
					}
					if (value < 1) {
						value = 10;
					}
					setGlobalRowLimit(value);
				}}
			/>
		</div>
	);
}

export { Limit };
