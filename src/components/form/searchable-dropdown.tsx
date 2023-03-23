import { OptionProps } from '@/components/form/input';
import { AbstractDropdown, DropdownProps } from '@/components/form/libs/abstract.dropdown';
import { handleErrors } from '@/libs/handle-errors';
import React from 'react';

export interface SearchableDropdownProps extends Omit<DropdownProps<OptionProps>, 'value' | 'onClickHandler' | 'handleChange'> {
    currentValue: string;
    handleChange: (e: any) => void;
    onClickHandler: (onChange: any, value: OptionProps) => void;
    value: OptionProps;
}

export class SearchableDropdown extends AbstractDropdown<SearchableDropdownProps, any> {
    public componentDidMount() {
        super.componentDidMount();
        this.setState({ searchedOptions: this.props?.options || [] });
    }

    public componentDidUpdate(prevProps: Readonly<any>, prevState: Readonly<any>, snapshot?: any) {
        super.componentDidUpdate(prevProps, prevState);
        if (prevState.searchedValue !== this.state.searchedValue) {
            this.manageSearch();
        }
    }

    public manageEnterKeyPress() {
        if (!this.props.value) {
            this.handleKeypressChange(this.state.searchedOptions[0]);
        }
        this.setState({ show: false });
    }

    public manageTabKeyPress() {
        this.setState({ show: false });
    }

    public manageEscapeKeyPress() {
        this.setState({ show: false });
    }

    public manageSteps(direction: 'up' | 'down') {
        try {
            const index = this.getIndex(direction);
            this.handleKeypressChange(this.state.searchedOptions[index]);
        } catch (e) {
            handleErrors(e);
        }
    }

    public handleKeypressChange(value: OptionProps) {
        this.props.handleChange({ target: { value } });
    }

    public getIndex(direction: 'up' | 'down'): number {
        if (!this.props.value) {
            return direction === 'down' ? 0 : this.state.searchedOptions.length - 1;
        }

        let index = 0;
        const options: OptionProps[] = this.state.searchedOptions;

        for (const option of options) {
            if (option.value === this.props.value.value) {
                return direction === 'down' ? index + 1 : index - 1;
            }
            index++;
        }

        throw 'No options to search';
    }

    public manageSearch() {
        const regex = new RegExp(this.state?.searchedValue || '', 'i');
        const searchedOptions = (this.props?.options || []).filter(({ title }) => regex.test(title.toString()));

        this.setState({ searchedOptions });
    }

    public renderArrows() {
        return this.state.show
            ? <ArrowUp color={'rgba(8, 61, 66, 0.53)'} className={'position-center arrow-wrapper'} width={15}/>
            : <ArrowDown color={'rgba(8, 61, 66, 0.53)'} className={'position-center arrow-wrapper'} width={15}/>;
    }

    public renderDropdownContent() {
        return <>
            {this.renderSearchInput()}
            {(this.state.searchedOptions || []).map(option => this.renderOption(option))}
        </>;
    }

    public renderInputContent() {
        return <>
            <input
                className={'input display-none'}
                onChange={(e) => this.props.handleChange(e)}
                value={this.props.value as any}
                type={'text'}
                name={this.props.name}
                id={this.props.id}
                readOnly={true}
                required={this.props.required}
                placeholder={this.props.placeholder}
                disabled={this.props.disabled}
            />

            <span className={'searchable-input w-100 fs-13 line-height-17 p-3'}>{this.props?.value?.title || '-'}</span>

            {this.renderArrows()}
        </>;
    }

    public handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ searchedValue: e.target.value });
    };

    public renderSearchInput() {
        return <input
            className={'input search-bar-input'}
            onChange={(e) => this.handleChange(e)}
            value={this.state.searchedValue}
            type={'text'}
            placeholder={'Type here...'}
        />;
    }

    public renderOption(option: OptionProps) {
        const { value, title } = option;
        const isChosen = this.props.value?.value === value;

        return <span
            ref={ref => (this.refs as any).push(ref)}
            key={`${value}-${title}`}
            onClick={() => this.props.onClickHandler(isChosen, option)}
            className={`${isChosen && 'select-input-active-option'} fs-14 hover-primary pb-4`}
        >
            {title}
        </span>;
    }
}
