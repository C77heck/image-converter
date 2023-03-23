import { FieldProps } from '@/components/form/libs/abstract.dropdown';
import { CONSTANTS } from '@/components/form/libs/constants';
import { InputWrapper } from '@/components/form/libs/input-wrapper';
import { MultiSearchableDropdown } from '@/components/form/multi-searchable.input';
import { SearchableDropdown } from '@/components/form/searchable-dropdown';
import { TextInput } from '@/components/form/text-input';
import { useInput } from '@/libs/hooks/input-handler.hook';
import React, { RefObject } from 'react';

export interface ValidatorInterface {
    hasError: boolean;
    errorMessage: string;
}

export interface OptionProps {
    value: string | number;
    title: string | number;
}

export const Input = (props: FieldProps) => {
    const { state, handleDataChange, focusChange } = useInput({ hasError: false, isInFocus: true, errorMessage: '' });
    const prodRef: RefObject<HTMLDivElement> = React.createRef();
    const { INPUTS } = CONSTANTS;

    const validate = (value: string): ValidatorInterface => {
        const hasErrors = !!props.validators && !!props.validators.length
            ? props.validators.map((validator: any) => validator(value)).filter((res: ValidatorInterface) => res.hasError)
            : [];

        if (!hasErrors.length) {
            return { hasError: false, errorMessage: '' };
        }

        return hasErrors[0];
    };

    const handleChange = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
        const { hasError, errorMessage } = validate(value);

        props.onChange({
            value,
            valid: !hasError,
            inputName: props.name
        });
        handleDataChange({ hasError, errorMessage });
    };

    const singleOnClickHandler = (isChosen: boolean, option: OptionProps) => {
        props.onChange({
            value: isChosen ? '' : option,
            valid: !state.hasError,
            inputName: props.name
        });
    };

    const multiOnClickHandler = (options: OptionProps[]) => {
        props.onChange({
            value: options,
            valid: !state.hasError,
            inputName: props.name
        });
    };

    const manageInputType = (element: string) => {
        switch (element) {
            case INPUTS.DROPDOWN:
                return <TextInput
                    onFocus={() => focusChange({ value: true })}
                    onBlur={() => focusChange({ value: false })}
                    {...props}
                    handleChange={handleChange}
                    value={props.value}
                />; // will need the dropdown
            case INPUTS.SEARCHABLE_DROPDOWN:
                return <SearchableDropdown
                    currentValue={''}
                    options={props?.options || []}
                    {...props}
                    handleChange={handleChange}
                    value={props.value as OptionProps}
                    onClickHandler={(isChosen: boolean, option: OptionProps) => singleOnClickHandler(isChosen, option)}
                />;
            case INPUTS.MULTI_SEARCHABLE_DROPDOWN:
                return <MultiSearchableDropdown
                    options={props?.options || []}
                    {...props}
                    handleChange={handleChange}
                    value={props.value as OptionProps[]}
                    onClickHandler={(options: OptionProps[]) => multiOnClickHandler(options)}
                />;
            case INPUTS.CHECKBOX:
                return <Checkbox
                    {...props}
                    handleChange={handleChange}
                    value={props.value}
                />;
            default:
                return <TextInput
                    onFocus={() => focusChange({ value: true })}
                    onBlur={() => focusChange({ value: false })}
                    {...props}
                    handleChange={handleChange}
                    value={props.value}
                />;
        }
    };

    const element = props?.element || '';

    switch (element) {
        case INPUTS.CHECKBOX:
            return manageInputType(element);
        case INPUTS.SEARCHABLE_DROPDOWN:
            return <InputWrapper {...props} {...{ prodRef, ...state }} isOverflowHidden={true}>{manageInputType(element)}</InputWrapper>;
        case INPUTS.MULTI_SEARCHABLE_DROPDOWN:
            return <InputWrapper {...props} {...{ prodRef, ...state }} isOverflowHidden={true}>{manageInputType(element)}</InputWrapper>;
        default:
            return <InputWrapper {...props} {...{ prodRef, ...state }}>{manageInputType(element)}</InputWrapper>;
    }
};
