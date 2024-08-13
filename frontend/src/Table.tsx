import React from "react";
import { Columns, TableData } from "./types";
import { create } from "zustand";

type TableProps = {
	columns: Columns[];
	tableData: TableData<any>;
};

const Table = ({ columns, tableData }: TableProps) => {
	return (
		<div>
			{columns.length > 0 && (
				<table className='h-fit text-left p-1 min-w-fit'>
					<thead>
						<tr>
							{columns.map((column) => (
								<th
									key={column.name}
									className='p-2 border-x-2 border-slate-700 sticky top-0 bg-slate-950 text-nowrap px-2'
								>
									<span>
										{column.name} : {column.dataType}
									</span>
								</th>
							))}
						</tr>
					</thead>

					{tableData.length > 0 && (
						<tbody>
							{tableData.map((data, index) => (
								<tr key={index} className='bg-slate-700   even:bg-slate-950'>
									{columns.map((column, index) => (
										<td key={index} className='  p-2'>
											{data[column.name]}
										</td>
									))}
								</tr>
							))}
						</tbody>
					)}
				</table>
			)}
		</div>
	);
};

export default Table;
