import { useEffect, useState } from "react";
import logo from "./assets/images/logo-universal.png";
import { OnFileDrop } from "../wailsjs/runtime/runtime";
import "./App.css";
import { Greet } from "../wailsjs/go/main/App";

function App() {
	const [resultText, setResultText] = useState(
		"Please enter your name below 👇"
	);
	const [name, setName] = useState("");
	const updateName = (e: any) => setName(e.target.value);
	const updateResultText = (result: string) => setResultText(result);

	useEffect(() => {
		OnFileDrop((x, y, file) => {
			console.log(file[0]);
			if (file[0].endsWith(".db")) {
				// setFilePath(() => file[0]);
			} else {
				// ShowWrongFileTypeMessage();
			}
		}, true);
	}, []);

	function greet() {
		Greet(name).then(updateResultText);
	}

	return (
		<div id='App' className='dropable'>
			<img src={logo} id='logo' alt='logo' />
			<div id='result' className='result'>
				{resultText}
			</div>
			<div id='input' className='input-box'>
				<input
					id='name'
					className='input'
					onChange={updateName}
					autoComplete='off'
					name='input'
					type='text'
				/>
				<button className='btn' onClick={greet}>
					Greet
				</button>
			</div>
		</div>
	);
}

export default App;
