import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Scale, AlertCircle } from 'lucide-react'
import ApiService from '../services/api'

export default function LoginPage({ onLogin }) {
  const [caseNumber, setCaseNumber] = useState('')
  const [accessCode, setAccessCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    try {
      const response = await ApiService.authenticate(caseNumber, accessCode)
      if (response.success && response.case) {
        onLogin({
          caseNumber: response.case.case_number,
          clientName: response.case.client_name,
          propertyAddress: response.case.property_address,
          caseData: response.case
        })
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Login Form */}
        <div className="flex justify-center">
          <Card className="w-full max-w-md shadow-xl">
            <CardHeader className="text-center space-y-4">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Scale className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">DFW Eviction Pros</h1>
              </div>
              <CardTitle className="text-xl">Client Portal</CardTitle>
              <CardDescription>Track Your Case Progress</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">{error}</span>
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="caseNumber">Case Number</Label>
                  <Input
                    id="caseNumber"
                    type="text"
                    placeholder="Enter your case number"
                    value={caseNumber}
                    onChange={(e) => setCaseNumber(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accessCode">Access Code</Label>
                  <Input
                    id="accessCode"
                    type="password"
                    placeholder="Enter your access code"
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value)}
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={isLoading}
                >
                  {isLoading ? 'Accessing...' : 'Access My Case'}
                </Button>
                <div className="text-center">
                  <a href="#" className="text-sm text-blue-600 hover:underline">
                    Forgot access code?
                  </a>
                </div>
                <div className="text-center text-xs text-gray-500 mt-4">
                  <p>Demo credentials:</p>
                  <p>Case: 21456, Code: test123</p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right side - Illustration */}
        <div className="hidden lg:flex justify-center items-center">
          <div className="text-center space-y-6">
            <div className="w-64 h-64 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
              <Scale className="w-32 h-32 text-blue-600" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">Secure Case Access</h2>
              <p className="text-gray-600 max-w-md">
                Stay informed about your eviction case progress with real-time updates 
                and secure document access.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

