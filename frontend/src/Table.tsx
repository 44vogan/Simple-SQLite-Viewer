import React from "react";
import { Columns } from "./types";
import { create } from "zustand";

type TableProps = {
	columns: Columns[];
};

const Table = ({ columns }: TableProps) => {
	return (
		<div>
			{columns.map((column) => (
				<div key={column.name}>
					{column.name}:{column.dataType}
				</div>
			))}
		</div>
	);
};

export default Table;
