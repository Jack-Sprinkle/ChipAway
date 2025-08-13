export default function HomePage() {
  return (
    <div className="container-sm flex flex-col gap-4">
      <h1 className="text-3xl">Home</h1>
      <p className="pl-4">
        This is a Progressive Web Application. Please add it to your home screen
        to make your life a bit easier. I put some steps below. The goal of this
        PWA is to have a simple, light weight, phone application that doesn&apos;t
        overwhelm you with options, stats, or other information mid-round.
      </p>
      <p className="pl-4">
        My intent is to keep this platform lightweight and simple. This application strictly uses the browser and its native
        Indexed Database to store the information you provide about your round
        or clubs.
      </p>
      <p className="pl-4">
        You can currently start a round, add holes to that round, and then save
        it. You can add clubs to your bag to track distances that you always
        forget just like me. You can also see previous rounds that you have
        saved.
      </p>
      <div className="pl-4">
        <p className="font-semibold underline">
          Features currently lacking (to be added soon):
        </p>
        <ol className="list-decimal pl-6">
          <li>
            No stat tracking on previous rounds like average FIR, GIR, Putts,
            etc.
          </li>
          <li>
            Offline support is not yet available, but I’m hoping to add it soon.
          </li>
          <li>
            Add Handicap Index calculation.
          </li>
        </ol>
        <p className="text-sm mt-4 italic">
          I&apos;ll do my best to keep this list updated as I encounter issues
          or think of new features to add.
        </p>
      </div>
      <h3 className="text-2xl">How to Add This PWA to Your Home Screen</h3>
      <div className="pl-4">
        <ol className="list-decimal pl-6">
          <li>
            Click on the three-line menu icon in the top-right corner of the
            browser.
          </li>
          <li>Select &quot;Add app to Home Screen&quot; from the menu.</li>
          <li>These steps should work for both Firefox and Chrome.</li>
        </ol>
        <p className="font-semibold underline">Using Safari:</p>
        <ol className="list-decimal pl-6">
          <li>Click on the share icon.</li>
          <li>Select &quot;Add to Home Screen&quot; from the menu.</li>
          <li>
            Confirm the settings you&apos;d like and then tap &apos;Add&apos;.
          </li>
        </ol>
      </div>
    </div>
  );
}
