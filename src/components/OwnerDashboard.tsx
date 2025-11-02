export default function OwnerDashboard({ user, onLogout }: { user: any; onLogout: () => void }) {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Owner Dashboard</h1>
      <p>Welcome, {user?.name}!</p>
      <p>Email: {user?.email}</p>
      <button onClick={onLogout} style={{ padding: '10px 20px', marginTop: '20px' }}>
        Logout
      </button>
    </div>
  );
}