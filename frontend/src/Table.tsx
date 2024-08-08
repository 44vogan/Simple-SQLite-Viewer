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
				<table className='h-fit text-left p-1'>
					<thead>
						<tr>
							{columns.map((column) => (
								<th
									key={column.name}
									className='border-x sticky top-0 bg-slate-950 '
								>
									{column.name} : {column.dataType}
								</th>
							))}
						</tr>
					</thead>

					{tableData.length > 0 && (
						<tbody>
							{tableData.map((data, index) => (
								<tr key={index} className='bg-slate-900   even:bg-slate-950'>
									{columns.map((column, index) => (
										<td key={index}>{data[column.name]}</td>
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
