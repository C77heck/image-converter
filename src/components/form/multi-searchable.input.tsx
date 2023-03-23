import { OptionProps } from '@/components/form/input';
import { AbstractDropdown, DropdownProps, DropdownState } from '@/components/form/libs/abstract.dropdown';
import { ArrowDown, ArrowUp } from '@/components/icons/icons';
import { handleErrors } from '@/libs/handle-errors';
import React from 'react';

export interface MultiSearchableDropdownProps extends Omit<DropdownProps<OptionProps[]>, 'onClickHandler' | 'value'> {
    onClickHandler: (options: OptionProps[]) => void;
    value: OptionProps[];
}

// todo we need a stepper and we only chose one if we press enter but with enter we do not close the dropdown but with escape
export class MultiSearchableDropdown extends AbstractDropdown<MultiSearchableDropdownProps, DropdownState> {
    public componentDidMount() {
        super.componentDidMount();
        this.setState({ searchedOptions: this.props?.options || [] } as any);
    }

    public componentDidUpdate(prevProps: Readonly<any>, prevState: Readonly<any>, snapshot?: any) {
        super.componentDidUpdate(prevProps, prevState);
        if (prevState.searchedValue !== this.state.searchedValue) {
            this.manageSearch();
        }
    }

    public manageEnterKeyPress() {
        if (!this.props.value?.length) {
            this.handleKeypressChange(this.state.searchedOptions[0]);
        }
        this.setState({ show: false } as any);
    }

    public manageTabKeyPress() {
        this.setState({ show: false } as any);
    }

    public manageEscapeKeyPress() {
        this.setState({ show: false } as any);
    }

    public manageSteps(direction: 'up' | 'down') {
        try {
            const index = this.getIndex(direction);
            const value = this.state.searchedOptions[this.getIndex(direction)];
            console.log({ index, value, options: this.props.options });
            this.handleKeypressChange(value);
        } catch (e) {
            handleErrors(e);
        }
    }

    public handleKeypressChange(newValue: OptionProps) {
        this.props.handleChange({ target: { value: [...(this.props?.value || []), newValue] } });
    }

    public getIndex(direction: 'up' | 'down'): number {
        if (!this.props.value?.length) {
            return direction === 'down' ? 0 : this.state.searchedOptions.length - 1;
        }

        let index = 0;
        const options: OptionProps[] = this.state.searchedOptions;

        for (const option of options) {
            const isChosen = !(this.props.value || []).find(v => v.value === option.value);
            console.log({ index, isChosen });
            if (isChosen) {
                return direction === 'down' ? index + 1 : index - 1;
            }
            index++;
        }

        return 0;
    }

    public handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ searchedValue: e.target.value } as any);
    };

    public manageSearch() {
        const regex = new RegExp(this.state?.searchedValue || '', 'i');
        const searchedOptions = (this.props?.options || []).filter(({ title }) => regex.test(title.toString()));

        this.setState({ searchedOptions } as any);
    }

    public renderDropdownContent() {
        return <>
            {this.renderSearchInput()}
            {(this.state.searchedOptions || []).map(option => this.renderOption(option))}
        </>;
    }

    public handleOnClick(isChosen: boolean, option: OptionProps) {
        if (!isChosen) {
            return this.props.onClickHandler([...(this.props?.value || []), option]);
        }

        return this.props.onClickHandler((this.props?.value || []).filter(item => item.value !== option.value));
    }

    public renderInputContent() {
        return <div
            className={'display-flex w-100'}
            onClick={() => this.setState({ show: !this.state.show } as any)}
        >
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
            {this.renderContent()}
            {this.renderArrows()}
        </div>;
    }

    public renderContent() {
        const picked = this.props?.value?.length;

        if (!picked) {
            return <span className={'searchable-input w-100 fs-13 line-height-17 p-3'}>-</span>;
        }

        if (picked > 4) {
            return <div className={'w-100 display-flex'}>
                {this.props.value.slice(0, 4).map(item => item?.title && <span key={item.title} className={'searchable-input--multi fs-12'}>{item.title}</span>)}
                <span className={'searchable-input--multi fs-12'}>...</span>
            </div>;
        }

        return <div className={'w-100 display-flex'}>
            {this.props.value.map(item => item?.title && <span key={item.title} className={'searchable-input--multi fs-12'}>{item.title}</span>)}
        </div>;
    }

    public renderSearchInput() {
        return <input
            className={'input search-bar-input'}
            onChange={(e) => this.handleChange(e)}
            value={this.state.searchedValue}
            type={'text'}
            placeholder={'Type here...'}
        />;
    }

    public renderArrows() {
        return this.state.show
            ? <ArrowUp color={'rgba(255,255,255,0.84)'} className={'position-center arrow-wrapper'} width={15}/>
            : <ArrowDown color={'rgba(255,255,255,0.95)'} className={'position-center arrow-wrapper'} width={15}/>;
    }

    public renderOption(option: OptionProps) {
        const { value, title } = option;

        const isChosen = !!(this.props.value || [])?.find(v => v.value === value);

        return <span
            key={`${value}-${title}`}
            onClick={() => this.handleOnClick(isChosen, option)}
            className={`${isChosen && 'select-input-active-option'} fs-14 hover-primary pb-4 w-100`}
        >
            {title}
        </span>;
    }
}
