import { OptionProps } from '@/components/form/input';
import * as React from 'react';

export type DispatchFunction<TOptions> = (options: TOptions) => void;

export interface FieldProps<TOptions = string[]> {
    type?: string;
    name: string;
    id?: string | undefined;
    readOnly?: boolean;
    required?: boolean;
    placeholder?: string;
    autoComplete?: string | undefined;
    disabled?: boolean | undefined;
    className?: string | undefined;
    inputClasses?: string;
    validators: any[];
    errorMessage?: string;
    label?: string;
    options?: OptionProps[];
    element?: 'text' | 'dropdown' | 'searchable_dropdown' | 'textarea' | 'checkbox' | 'datepicker' | string;
    isNumberOnly?: boolean;
    value: string | string[] | null | OptionProps | OptionProps[];
    onChange: DispatchFunction<any>;
    labelClass?: string;
    wrapperClasses?: string;
    rows?: number;
    cols?: number;
}

export interface DropdownProps<TValue> extends Omit<FieldProps<OptionProps>, 'value'> {
    handleChange: (e: any) => void;
    onClickHandler: (onChange: any, value: OptionProps) => void;
    value: TValue;
    options: OptionProps[];
}

export interface DropdownState {
    show: boolean;
    hasError: boolean;
    errorMessage: string;
    searchedOptions: OptionProps[];
    searchedValue: string;
}

export abstract class AbstractDropdown<TProps extends DropdownProps<any>, TState extends DropdownState> extends React.Component<TProps, TState | DropdownState> {
    public state = {
        show: false,
        hasError: false,
        errorMessage: '',
        searchedOptions: [],
        searchedValue: ''
    };
    // todo catch the refs and find the scroll into view... check the note.
    public spanRefs: React.RefObject<HTMLSpanElement | null>[] = [];

    public divRef: React.RefObject<any> = React.createRef();

    constructor(props: any) {
        super(props);
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    public componentDidMount() {
        this.assignClickHandler();
    }

    public componentWillUnmount() {
        this.removeClickHandler();
        this.assignKeyDownListener(false);
    }

    public assignClickHandler() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    public removeClickHandler() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    public handleClickOutside(event: any) {
        if (!this.divRef?.current?.contains(event.target)) {
            this.setState({ show: false } as any);
        }
    }

    public componentDidUpdate(prevProps: Readonly<any>, prevState: Readonly<any>, snapshot?: any) {
        if (prevState.show !== this.state.show) {
            this.assignKeyDownListener(this.state.show);
        }
    }

    public keyPressListener = this.assignKeyDownListener.bind(this);

    public assignKeyDownListener(isVisible: boolean): any {
        if (!isVisible) {
            const keyListener: any = this.keyPressListener;

            document.removeEventListener('keydown', keyListener);
        }

        const keyListener = this.listenForKeyPress.bind(this);

        this.keyPressListener = keyListener;

        return document.addEventListener('keydown', keyListener);
    }

    public listenForKeyPress(e: any) {
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                return this.manageSteps('down');
            case 'ArrowUp':
                e.preventDefault();
                return this.manageSteps('up');
            case 'Enter':
                return this.manageEnterKeyPress();
            case 'Tab':
                return this.manageTabKeyPress();
            case 'Escape':
                return this.manageEscapeKeyPress();
            default:
                return;
        }
    }

    public render(): JSX.Element {
        return <div className={'w-100'} ref={this.divRef}>
            <div className={'display-flex'} onClick={() => this.setState({ show: !this.state.show } as any)}>
                {this.renderInputContent()}
            </div>
            <div className={`${this.props.className} dropdown-general dropdown dropdown--searchable dropdown--${this.state.show ? 'show' : 'hide'} display-flex flex-column`}>
                {this.renderDropdownContent()}
            </div>
        </div>;
    };

    public abstract renderInputContent(): JSX.Element;

    public abstract renderDropdownContent(): JSX.Element;

    public abstract manageSteps(direction: 'down' | 'up'): void;

    public abstract getIndex(direction: 'down' | 'up'): number;

    public abstract manageEnterKeyPress(): void;

    public abstract manageTabKeyPress(): void;

    public abstract manageEscapeKeyPress(): void;
}
