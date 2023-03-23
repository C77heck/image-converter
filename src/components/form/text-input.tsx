import React, { Component } from 'react';
import { Eyeicon } from '../../components/icons/icons';

export class TextInput extends Component<any, any> {
    public state = {
        type: this.props.type || 'text',
    };

    public managePasswordType() {
        this.setState({ type: this.state.type === 'text' ? 'password' : 'text' });
    }

    public render() {
        return <div className={'position-center w-100'}>
            <input
                className={`input ${this.props.inputClasses} h-px-35 w-100 pl-8`}
                onChange={(e) => this.props.handleChange(e)}
                value={this.props.value}
                type={this.state.type}
                name={this.props.name}
                id={this.props.id}
                readOnly={this.props.readOnly}
                required={this.props.required}
                placeholder={this.props.placeholder}
                autoComplete={this.props.autoComplete}
                disabled={this.props.disabled}
                onFocus={() => this.props.onFocus()}
                onBlur={() => this.props.onBlur()}
            />
            {this.props.type === 'password' && <Eyeicon
                onClick={() => this.managePasswordType()}
                width={25}
                className={`hover-opacity pt-3 pr-4 ${this.state.type === 'text' ? 'color--secondary-1' : ''}`}
            />}
        </div>;
    }
}
