export default function OfflinePage() {
    return (
        <main className="flex items-center justify-center min-h-screen bg-gradient-to-b from-green-50 to-white px-4">
            <div className="text-center max-w-sm">
                <div className="mb-6 text-6xl">📡</div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">You&apos;re Offline</h1>
                <p className="text-gray-600 text-lg mb-8">
                    No internet connection, but don&apos;t worry—your scores are saved locally.
                </p>
                <p className="text-gray-500 text-sm">Check your connection and refresh to get back online.</p>
            </div>
        </main>
    );
}
