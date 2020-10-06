import React from "react";

export default class Key extends React.Component {
	render() {
		const { className, ...props } = this.props;

		return <button className={`key ${className}`} {...props} />;
	}
}
