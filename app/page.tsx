export default function HomePage() {
    return (
        <div className="container-sm flex flex-col gap-4">
            <h1 className="text-3xl">Home</h1>
            <p className="pl-4">
                This is a Progressive Web Application. Please add it to your
                home screen to make your life a bit easier. I put some steps
                below. This web application is designed to be a one stop shop
                for your golf game. It is a scorecard that will help you keep
                track of simple stats, see previous rounds you&apos;ve recorded,
                and see your combinee stats. You can also log range and practice
                sessions, or get drills for areas you feel you need improvement.
            </p>
            <h3 className="text-2xl">
                How to Add This PWA to Your Home Screen
            </h3>
            <div className="pl-4">
                <ol className="list-decimal pl-6">
                    <li>
                        Click on the three-line menu icon in the top-right
                        corner of the browser.
                    </li>
                    <li>
                        Select &quot;Add app to Home Screen&quot; from the menu.
                    </li>
                    <li>
                        These steps should work for both Firefox and Chrome.
                    </li>
                </ol>
                <p className="font-semibold underline">Using Safari:</p>
                <ol className="list-decimal pl-6">
                    <li>Click on the share icon.</li>
                    <li>
                        Select &quot;Add to Home Screen&quot; from the menu.
                    </li>
                    <li>
                        Confirm the settings you&apos;d like and then tap
                        &apos;Add&apos;.
                    </li>
                </ol>
            </div>
        </div>
    );
}
