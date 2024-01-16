export default function Heading(props) {
    return (
        <h1 className="text-5xl p-4 text-blue-500 dark:text-indigo-500">{props.children}</h1>
    );
}