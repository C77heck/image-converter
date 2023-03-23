export interface LoaderProps {
    loading: boolean;
    children: JSX.Element | JSX.Element[];
}

export const Loader = ({ loading, children }: LoaderProps) => {
    if (!loading) {
        return <>{children}</>;
    }

    return <div className={'w-100 h-100 position-center'}>
        <svg className={'spinner'} viewBox="0 0 50 50">
            <circle stroke={'rgb(195,197,197)'} className="path1" cx="25" cy="25" r="20" fill="none" strokeWidth="2"></circle>
        </svg>
    </div>;
};
