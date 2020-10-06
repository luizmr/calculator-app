import React from "react";

export default class Display extends React.Component {
	render() {
		const { value, ...props } = this.props;

		return (
			<div className="display" {...props}>
				{value}
			</div>
		);
	}
}
