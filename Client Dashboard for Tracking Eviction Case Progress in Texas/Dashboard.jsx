import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Scale, 
  Phone, 
  Mail, 
  Download, 
  Calendar, 
  MapPin, 
  FileText, 
  CheckCircle, 
  Circle, 
  Clock,
  LogOut,
  User,
  Loader2
} from 'lucide-react'
import ApiService from '../services/api'

export default function Dashboard({ caseData, onLogout }) {
  const [timeline, setTimeline] = useState([])
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      if (!caseData?.caseNumber) return
      
      try {
        setLoading(true)
        const [timelineData, documentsData] = await Promise.all([
          ApiService.getCaseTimeline(caseData.caseNumber),
          ApiService.getCaseDocuments(caseData.caseNumber)
        ])
        
        setTimeline(timelineData)
        setDocuments(documentsData)
      } catch (err) {
        setError(err.message || 'Failed to load case data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [caseData?.caseNumber])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading case data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={onLogout}>Return to Login</Button>
        </div>
      </div>
    )
  }

  const currentStep = caseData.caseData?.current_step || 1
  const totalSteps = caseData.caseData?.total_steps || 7
  const progressPercentage = (currentStep / totalSteps) * 100

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const formatDateTime = (dateString) => {
    if (!dateString) return 'Not set'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    })
  }

  const getNextHearingInfo = () => {
    const hearingEvent = timeline.find(event => event.status === 'current' && event.title === 'Court Hearing')
    if (hearingEvent && hearingEvent.event_date) {
      return {
        date: formatDate(hearingEvent.event_date),
        time: '9:00 AM' // Default time, could be enhanced to store actual time
      }
    }
    return { date: 'TBD', time: '' }
  }

  const nextHearing = getNextHearingInfo()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Scale className="w-8 h-8" />
              <h1 className="text-xl font-bold">DFW Eviction Pros</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span className="text-sm">{caseData.clientName}</span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-blue-600 border-white hover:bg-blue-50"
                onClick={onLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Hero Section */}
        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-3 gap-6 items-center">
              <div className="text-center md:text-left">
                <div className="relative w-24 h-24 mx-auto md:mx-0 mb-4">
                  <svg className="w-24 h-24 transform -rotate-90">
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      className="text-gray-200"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={`${2 * Math.PI * 40}`}
                      strokeDashoffset={`${2 * Math.PI * 40 * (1 - progressPercentage / 100)}`}
                      className="text-blue-600"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-semibold text-blue-600">
                      {Math.round(progressPercentage)}%
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-center md:text-left">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {caseData.caseData?.current_status || 'Case Active'}
                </h2>
                <div className="flex items-center justify-center md:justify-start text-gray-600 mb-4">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{caseData.propertyAddress}</span>
                </div>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  Case #{caseData.caseNumber}
                </Badge>
              </div>
              <div className="text-center">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <h3 className="font-semibold text-gray-900 mb-2">Next Step</h3>
                  <div className="flex items-center justify-center text-blue-600 mb-2">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span className="font-medium">{nextHearing.date}</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {nextHearing.time ? `Court Hearing at ${nextHearing.time}` : 'Awaiting schedule'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Case Information */}
          <div className="space-y-6">
            {/* Case Details */}
            <Card>
              <CardHeader>
                <CardTitle>Case Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Case Number</span>
                  <span className="font-medium">{caseData.caseNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">County</span>
                  <span className="font-medium">{caseData.caseData?.county || 'Dallas'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Court</span>
                  <span className="font-medium">{caseData.caseData?.court || 'JP 4-1'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Filed Date</span>
                  <span className="font-medium">{formatDate(caseData.caseData?.filed_date)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Important Dates */}
            <Card>
              <CardHeader>
                <CardTitle>Important Dates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Notice Served</span>
                  <span className="font-medium">{formatDate(caseData.caseData?.notice_served_date)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Hearing Date</span>
                  <span className="font-medium text-blue-600">{formatDateTime(caseData.caseData?.hearing_date)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Response Deadline</span>
                  <span className="font-medium">{formatDate(caseData.caseData?.response_deadline)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-blue-600" />
                  <div>
                    <p className="font-medium">(945) 998-0643</p>
                    <p className="text-sm text-gray-600">Main Office</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-blue-600" />
                  <div>
                    <p className="font-medium">support@dfw-eviction.com</p>
                    <p className="text-sm text-gray-600">Email Support</p>
                  </div>
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Center Column - Timeline */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Case Progress Timeline</CardTitle>
                <CardDescription>Track your eviction case through each step</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {timeline.map((step, index) => (
                    <div key={step.id} className="flex items-start space-x-4">
                      <div className="flex flex-col items-center">
                        {step.status === 'completed' ? (
                          <CheckCircle className="w-6 h-6 text-green-600" />
                        ) : step.status === 'current' ? (
                          <Circle className="w-6 h-6 text-blue-600 fill-current" />
                        ) : (
                          <Circle className="w-6 h-6 text-gray-300" />
                        )}
                        {index < timeline.length - 1 && (
                          <div className={`w-0.5 h-12 mt-2 ${
                            step.status === 'completed' ? 'bg-green-600' : 'bg-gray-200'
                          }`} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className={`font-medium ${
                            step.status === 'current' ? 'text-blue-600' : 
                            step.status === 'completed' ? 'text-green-600' : 'text-gray-500'
                          }`}>
                            {step.title}
                          </h4>
                          {step.status === 'current' && (
                            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                              Current Step
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {step.event_date ? formatDate(step.event_date) : 
                           step.estimated_date ? `Est. ${formatDate(step.estimated_date)}` : 'TBD'}
                        </p>
                        {step.status === 'completed' && (
                          <p className="text-sm text-green-600 mt-1">Completed</p>
                        )}
                        {step.status === 'pending' && (
                          <p className="text-sm text-gray-500 mt-1">Pending</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Documents & Payment */}
          <div className="space-y-6">
            {/* Documents */}
            <Card>
              <CardHeader>
                <CardTitle>Documents</CardTitle>
                <CardDescription>Download case-related documents</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <div>
                        <p className="font-medium text-sm">{doc.name}</p>
                        <p className="text-xs text-gray-600">{formatDate(doc.uploaded_date)}</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Payment Status */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center p-6">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                    caseData.caseData?.payment_status === 'Paid' ? 'bg-green-100' : 'bg-yellow-100'
                  }`}>
                    <CheckCircle className={`w-8 h-8 ${
                      caseData.caseData?.payment_status === 'Paid' ? 'text-green-600' : 'text-yellow-600'
                    }`} />
                  </div>
                  <h3 className={`font-semibold mb-2 ${
                    caseData.caseData?.payment_status === 'Paid' ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {caseData.caseData?.payment_status === 'Paid' ? 'Paid in Full' : 'Payment Pending'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {caseData.caseData?.payment_status === 'Paid' 
                      ? 'All service fees have been paid' 
                      : 'Payment required to proceed'}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card>
              <CardHeader>
                <CardTitle>What's Next?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Clock className="w-4 h-4 text-blue-600 mt-1" />
                    <div>
                      <p className="font-medium text-sm">Prepare for Hearing</p>
                      <p className="text-xs text-gray-600">Review your case documents before the court date</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Calendar className="w-4 h-4 text-blue-600 mt-1" />
                    <div>
                      <p className="font-medium text-sm">Court Appearance</p>
                      <p className="text-xs text-gray-600">
                        {caseData.caseData?.hearing_date 
                          ? `Attend the hearing on ${formatDateTime(caseData.caseData.hearing_date)}`
                          : 'Hearing date to be scheduled'}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

