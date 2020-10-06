import React from "react";
import "./App.css";
import Display from "./components/Display";
import Key from "./components/Key";

const CalculatorOperations = {
	"/": (storedValue, newValue) =>
		newValue === 0
			? "division by zero"
			: parseFloat(storedValue / newValue),
	"*": (storedValue, newValue) => newValue * storedValue,
	"+": (storedValue, newValue) => newValue + storedValue,
	"-": (storedValue, newValue) => storedValue - newValue,
	"%": (storedValue, newValue) => newValue / 100,
	"=": (storedValue, newValue) => newValue,
};

export default class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			value: null,
			operation: null,
			operationInProgress: false,
			displayValue: "0",
			clearText: "C",
		};
	}

	calculate(operand1, operand2, operation) {
		let uri = "http://localhost:3000/arithmetic";

		switch (operation) {
			case "+":
				uri += "?operation=add";
				break;
			case "-":
				uri += "?operation=subtract";
				break;
			case "*":
				uri += "?operation=multiply";
				break;
			case "/":
				uri += "?operation=divide";
				break;
			default:
				// setError();
				return;
		}

		uri += "&operand1=" + encodeURIComponent(operand1);
		uri += "&operand2=" + encodeURIComponent(operand2);

		const http = require("http");

		http.get(uri, (res) => {
			let body = "";

			res.on("data", (chunk) => {
				body += chunk;
			});

			res.on("end", () => {
				try {
					let json = JSON.parse(body);
					console.log(json);
				} catch (error) {
					console.error(error.message);
				}
			});
		}).on("error", (error) => {
			console.error(error.message);
		});

		console.log(uri, "uri");
	}

	clearDisplay() {
		const {
			clearText,
			displayValue,
			operation,
			operationInProgress,
		} = this.state;

		if (operationInProgress) {
			this.setState({
				displayValue: operation == "=" ? "0" : displayValue,
				operation: null,
				value: null,
				operationInProgress: false,
				clearText: "C",
			});
		} else {
			if (clearText == "AC") {
				this.setState({
					displayValue: "0",
					clearText: "C",
				});
			} else {
				this.setState({
					value: null,
					operation: null,
					operationInProgress: false,
					displayValue: "0",
					clearText: "C",
				});
			}
		}
	}

	negateValue() {
		const { displayValue } = this.state;

		this.setState({
			displayValue: (parseFloat(displayValue) * -1).toString(),
		});
	}

	inputDigit(digit) {
		const { displayValue, operationInProgress } = this.state;

		if (operationInProgress) {
			this.setState({
				displayValue: digit.toString(),
				operationInProgress: false,
			});
		} else {
			this.setState({
				displayValue:
					displayValue === "0"
						? digit.toString()
						: displayValue + digit.toString(),
			});
		}

		this.setState({ clearText: "AC" });
	}

	inputDecimalPoint() {
		const { displayValue, operationInProgress } = this.state;

		if (operationInProgress) {
			this.setState({
				displayValue: "0.",
				operationInProgress: false,
			});
		} else {
			this.setState({
				displayValue: /\./.test(displayValue)
					? displayValue
					: displayValue + ".",
			});
		}

		this.setState({ clearText: "AC" });
	}

	doOperation(nextOperation) {
		const { value, displayValue, operation } = this.state;
		const inputValue = parseFloat(displayValue);

		if (nextOperation == "%") {
			this.setState({
				value: null,
				displayValue: CalculatorOperations[nextOperation](
					value,
					inputValue
				),
			});
		} else {
			if (value == null) {
				this.setState({ value: inputValue });
			} else {
				const newValue = CalculatorOperations[operation](
					value,
					inputValue
				);

				this.setState({
					value: newValue,
					displayValue: newValue.toString(),
				});
			}
		}

		if (nextOperation == "=") {
			this.setState({
				clearText: "C",
			});

			// do the calculation using node server
			console.log(
				this.calculate(this.state.value, inputValue, "+"),
				"calculate"
			);
		}

		this.setState({
			operationInProgress: true,
			operation: nextOperation,
		});
	}

	keyPressedDown = (e) => {
		let { key } = e;

		if (key === "Enter") {
			key = "=";
		}

		if (/\d/.test(key)) {
			e.preventDefault();
			this.inputDigit(parseInt(key, 10));
		} else if (key in CalculatorOperations) {
			e.preventDefault();
			this.doOperation(key);
		} else if (key === ".") {
			e.preventDefault();
			this.inputDecimalPoint();
		}
	};

	componentDidMount() {
		document.addEventListener("keydown", this.keyPressedDown);
	}

	componentWillUnmount() {
		document.removeEventListener("keydown", this.keyPressedDown);
	}

	render() {
		const {
			displayValue,
			clearText,
			operation,
			operationInProgress,
		} = this.state;
		return (
			<div className="calculator">
				<Display value={displayValue} />
				<div className="keypad">
					<Key
						className="key-function"
						onClick={() => this.clearDisplay()}
					>
						{clearText}
					</Key>
					<Key
						className="key-function"
						onClick={() => this.negateValue()}
					>
						+/-
					</Key>
					<Key
						className="key-function"
						onClick={() => this.doOperation("%")}
					>
						%
					</Key>
					<Key
						className={`key-operation ${
							operation == "/" ? "key-active" : ""
						}`}
						onClick={() => this.doOperation("/")}
					>
						&divide;
					</Key>

					<Key className="key-7" onClick={() => this.inputDigit(7)}>
						7
					</Key>
					<Key className="key-8" onClick={() => this.inputDigit(8)}>
						8
					</Key>
					<Key className="key-9" onClick={() => this.inputDigit(9)}>
						9
					</Key>
					<Key
						className={`key-operation ${
							operation == "*" ? "key-active" : ""
						}`}
						onClick={() => this.doOperation("*")}
					>
						&times;
					</Key>

					<Key className="key-4" onClick={() => this.inputDigit(4)}>
						4
					</Key>
					<Key className="key-5" onClick={() => this.inputDigit(5)}>
						5
					</Key>
					<Key className="key-6" onClick={() => this.inputDigit(6)}>
						6
					</Key>
					<Key
						className={`key-operation ${
							operation == "-" ? "key-active" : ""
						}`}
						onClick={() => this.doOperation("-")}
					>
						-
					</Key>

					<Key className="key-1" onClick={() => this.inputDigit(1)}>
						1
					</Key>
					<Key className="key-2" onClick={() => this.inputDigit(2)}>
						2
					</Key>
					<Key className="key-3" onClick={() => this.inputDigit(3)}>
						3
					</Key>
					<Key
						className={`key-operation ${
							operation == "+" ? "key-active" : ""
						}`}
						onClick={() => this.doOperation("+")}
					>
						+
					</Key>

					<Key className="key-0" onClick={() => this.inputDigit(0)}>
						0
					</Key>
					<Key
						className="key-point"
						onClick={() => this.inputDecimalPoint()}
					>
						.
					</Key>
					<Key
						className="key-equal key-operation"
						onClick={() => this.doOperation("=")}
					>
						=
					</Key>
				</div>
			</div>
		);
	}
}
