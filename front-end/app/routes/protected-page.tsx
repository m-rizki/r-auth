export default function ProtectedPage() {
  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content flex-col">
        <p>Protected Page</p>
        <div className="mt-8 flex flex-row gap-10">
          <button className="btn btn-outline btn-primary btn-sm">me</button>
          <button className="btn btn-outline btn-accent btn-sm">
            refresh-token
          </button>
          <button className="btn btn-outline btn-error btn-sm">logout</button>
        </div>
      </div>
    </div>
  );
}
