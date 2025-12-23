import { useState } from "react"
import { Lock, User } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"


export default function AdminLogin() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
 const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const res = await fetch("https://open-leaf.vercel.app/api/common/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
      })

      const data = await res.json()
        console.log('it is the data from username and password'+data)
      if (!res.ok) {
        throw new Error(data.message || "Login failed")
      }
      
      if (data.token) {
        // Save token
        localStorage.setItem("token", data.token)
        const token = localStorage.getItem("token");

         toast.success("Login successful");
        
        // Delay navigation so toast can show
        setTimeout(() => navigate("/panel"), 1000);
      } else {
        throw new Error("No token received")
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-lg border border-sky-200 w-full max-w-md p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="mx-auto w-12 h-12 bg-sky-500 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-sky-900">Admin Login</h2>
          <p className="text-sky-600 text-sm">
            Enter your credentials to access the admin panel
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-sky-800 font-medium mb-1">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-sky-500" />
              <input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-sky-200 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-400 disabled:bg-gray-100"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sky-800 font-medium mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-sky-500" />
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-sky-200 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-400 disabled:bg-gray-100"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="border border-red-200 bg-red-50 text-red-700 text-sm rounded-md p-3">
              {error}
            </div>
          )}

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-sky-500 hover:bg-sky-600 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:bg-sky-300"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Demo credentials */}
        <div className="mt-6 text-center">
          <p className="text-sm text-sky-600">
            Demo credentials: admin / password
          </p>
        </div>
      </div>
    </div>
  )
}
