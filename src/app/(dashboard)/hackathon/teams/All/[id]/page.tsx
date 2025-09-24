"use client"

import React, { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useGetTeamQuery } from '@/service/Api/teams'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog'
import Loading from '@/components/loading/loading'
import { 
  Calendar, 
  Trophy, 
  Star, 
  MapPin, 
  Mail, 
  Phone, 
  Building, 
  User, 
  FileText, 
  Video, 
  MessageCircle,
  Target,
  HelpCircle,
  ExternalLink,
  Clock,
  Hash,
  CreditCard,
  Users,
  FileCheck,
  Database,
  ArrowLeft,
  AlertCircle,
  ChevronLeft,
  Image as ImageIcon,
  UserPlus,
  Crown,
  X
} from 'lucide-react'
import { format } from 'date-fns'
import Image from 'next/image'

export default function TeamDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const teamId = params.id as string
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false)

  const {
    data: teamData,
    isLoading,
    error,
    isError,
    refetch
  } = useGetTeamQuery(teamId, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true
  })

  if (isLoading) {
    return (
      <div className="container mx-auto py-4 px-4 sm:py-6 sm:px-5">
        <Loading />
      </div>
    )
  }

  if (isError || error || !teamData?.data) {
    return (
      <div className="container mx-auto py-4 px-4 sm:py-6 sm:px-5">
        <div className="text-center py-8 sm:py-12">
          <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-lg sm:text-xl font-semibold mb-2">Error Loading Team Details</h2>
          <p className="text-muted-foreground mb-6 text-sm sm:text-base px-4">
            {error && 'status' in error 
              ? `Error ${error.status}: Unable to fetch team data`
              : 'Something went wrong while loading the team information'
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => refetch()} variant="outline" size="sm" className="sm:size-default">
              Try Again
            </Button>
            <Button onClick={() => router.back()} size="sm" className="sm:size-default">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const team = teamData.data

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not set'
    try {
      return format(new Date(dateString), 'PPP')
    } catch {
      return dateString
    }
  }

  const getStatusColor = (status: string | null) => {
    if (!status) return "secondary"
    switch (status.toLowerCase()) {
      case "approved": return "default"
      case "pending": return "secondary"
      case "rejected": return "destructive"
      default: return "outline"
    }
  }

  const getParticipationColor = (method: string) => {
    return method.toLowerCase() === "onsite" ? "default" : "secondary"
  }

  const getParticipantTypeColor = (type: string | null) => {
    if (!type) return "secondary"
    switch (type) {
      case "1": return "default"
      case "2": return "secondary"
      case "3": return "outline"
      default: return "secondary"
    }
  }

  const getParticipantTypeLabel = (type: string | null) => {
    if (!type) return "Not specified"
    switch (type) {
      case "1": return "Individual"
      case "2": return "Team Member"
      case "3": return "Group Leader"
      default: return `Type ${type}`
    }
  }

  return (
    <div className="container mx-auto py-4 px-4 sm:py-6 sm:px-5 max-w-7xl">
      {/* Header - Responsive */}
      <div className="mb-6 sm:mb-8">
        <Button variant="outline" className="mb-6" onClick={() => router.back()}>
          <ChevronLeft />
          <p>Go Back</p>
        </Button>
        
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white break-words">
              {team.team_name}
            </h1>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2 text-muted-foreground text-sm">
              <div className="flex items-center gap-1">
                <Hash className="w-4 h-4 flex-shrink-0" />
                <span>ID: {team.id}</span>
              </div>
              <div className="flex items-center gap-1">
                <Database className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">UUID: {team.uuid}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4 flex-shrink-0" />
                <span>Members: {team.members_count}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {team.status ? (
              <Badge variant={getStatusColor(team.status)} className="px-2 py-1 text-xs sm:px-3 sm:text-sm">
                {team.status}
              </Badge>
            ) : (
              <Badge variant="secondary" className="px-2 py-1 text-xs sm:px-3 sm:text-sm">
                No Status
              </Badge>
            )}
            <Badge variant={getParticipationColor(team.participation_method_id.title)} className="px-2 py-1 text-xs sm:px-3 sm:text-sm">
              <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
              <span className="truncate">{team.participation_method_id.title}</span>
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content - Responsive Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        {/* Left Column - Main Info */}
        <div className="xl:col-span-2 space-y-4 sm:space-y-6">
          
          {/* Team Photo Card */}
          {team.team_photo && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <ImageIcon className="w-5 h-5 text-primary flex-shrink-0" />
                  Team Photo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative w-full h-64 sm:h-80 rounded-lg overflow-hidden bg-muted cursor-pointer hover:opacity-90 transition-opacity"
                     onClick={() => setIsImageDialogOpen(true)}
                     role="button"
                     tabIndex={0}
                     onKeyDown={(e) => {
                       if (e.key === 'Enter' || e.key === ' ') {
                         e.preventDefault()
                         setIsImageDialogOpen(true)
                       }
                     }}
                     aria-label="Click to view full size image">
                  <Image
                    src={team.team_photo.url}
                    alt={`${team.team_name} team photo`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/10 transition-colors">
                    <div className="bg-black/50 text-white px-3 py-1 rounded-md opacity-0 hover:opacity-100 transition-opacity">
                      Click to enlarge
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Image Zoom Dialog */}
          <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
            <DialogContent 
              className="max-w-[95vw] max-h-[95vh] w-auto h-auto p-0 overflow-hidden"
              showCloseButton={false}
            >
              <div className="relative max-w-full max-h-[95vh] flex items-center justify-center">
                <Image
                  src={team.team_photo?.url || ''}
                  alt={`${team.team_name} team photo - Full size`}
                  width={0}
                  height={0}
                  sizes="95vw"
                  className="w-auto h-auto max-w-full max-h-[95vh] object-contain"
                  priority
                />
                <DialogClose className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors">
                  <X className="w-4 h-4" />
                  <span className="sr-only">Close</span>
                </DialogClose>
              </div>
            </DialogContent>
          </Dialog> 
             

     {/* Project Links Card - Mobile Friendly */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <FileText className="w-5 h-5 text-primary flex-shrink-0" />
                Project Resources
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <Button 
                  variant="outline" 
                  className="h-auto p-3 sm:p-4 justify-start text-left"
                  onClick={() => window.open(team.project_proposal_url, '_blank')}
                >
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5 mr-3 text-blue-600 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-sm sm:text-base">Project Proposal</div>
                    <div className="text-xs text-muted-foreground">View document</div>
                  </div>
                  <ExternalLink className="w-4 h-4 ml-2 flex-shrink-0" />
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-auto p-3 sm:p-4 justify-start text-left"
                  onClick={() => window.open(team.project_video_url, '_blank')}
                >
                  <Video className="w-4 h-4 sm:w-5 sm:h-5 mr-3 text-red-600 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-sm sm:text-base">Project Video</div>
                    <div className="text-xs text-muted-foreground">Watch presentation</div>
                  </div>
                  <ExternalLink className="w-4 h-4 ml-2 flex-shrink-0" />
                </Button>
              </div>
            </CardContent>
          </Card>


          {/* Team Members Card */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <UserPlus className="w-5 h-5 text-primary flex-shrink-0" />
                Team Members ({team.members_count})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {team.members && team.members.length > 0 ? (
                <div className="space-y-4">
                  {team.members.map((member) => (
                    <div key={member.id} className="border rounded-lg p-4">
                      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mx-auto sm:mx-0">
                          {member.member_role === 'team_lead' ? (
                            <Crown className="w-5 h-5 text-yellow-600" />
                          ) : (
                            <User className="w-5 h-5 text-primary" />
                          )}
                        </div>
                        <div className="flex-1 space-y-3 min-w-0">
                          <div className="text-center sm:text-left">
                            <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                              <h3 className="font-semibold text-base break-words">{member.name}</h3>
                              {member.member_role === 'team_lead' && (
                                <Badge variant="default" className="text-xs">
                                  <Crown className="w-3 h-3 mr-1" />
                                  Leader
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">UUID: {member.uuid}</p>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                            <div className="flex items-center gap-2 min-w-0">
                              <Mail className="w-4 h-4 text-blue-500 flex-shrink-0" />
                              <span className="truncate">{member.email}</span>
                            </div>
                            <div className="flex items-center gap-2 min-w-0">
                              <Phone className="w-4 h-4 text-green-500 flex-shrink-0" />
                              <span className="truncate">{member.phone_number}</span>
                            </div>
                            <div className="flex items-center gap-2 min-w-0">
                              <Building className="w-4 h-4 text-purple-500 flex-shrink-0" />
                              <span className="truncate">{member.organization}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-orange-500 flex-shrink-0" />
                              <span>Age: {member.age}</span>
                            </div>
                            <div className="flex items-center gap-2 min-w-0 md:col-span-2">
                              <CreditCard className="w-4 h-4 text-red-500 flex-shrink-0" />
                              <span className="truncate">National ID: {member.national}</span>
                            </div>
                          </div>
                          
                          <div className="flex gap-2 flex-wrap justify-center sm:justify-start">
                            <Badge variant={member.is_new ? "secondary" : "default"} className="text-xs">
                              {member.is_new ? "New Member" : "Returning Member"}
                            </Badge>
                            <Badge variant="outline" className="text-xs capitalize">
                              {member.member_role.replace('_', ' ')}
                            </Badge>
                            {member.participation_type && (
                              <Badge variant={getParticipantTypeColor(member.participation_type)} className="text-xs">
                                {getParticipantTypeLabel(member.participation_type)}
                              </Badge>
                            )}
                          </div>

                          {member.extra_field && (
                            <div className="bg-muted/50 p-3 rounded-md">
                              <p className="text-sm break-words"><strong>Extra Info:</strong> {member.extra_field}</p>
                            </div>
                          )}

                          {member.notes && (
                            <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-md">
                              <p className="text-sm break-words"><strong>Notes:</strong> {member.notes}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground italic">No members found</p>
              )}
            </CardContent>
          </Card>

          {/* Challenge Card */}
          {team.challenge_id ? (
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Target className="w-5 h-5 text-primary flex-shrink-0" />
                  Challenge Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg break-words">{team.challenge_id.title}</h3>
                    {/* <p className="text-sm text-muted-foreground">Challenge ID: {team.challenge.id}</p> */}
                  </div>
                  <p className="text-muted-foreground leading-relaxed break-words">
                    {team.challenge_id.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-muted-foreground" />
                  Challenge
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">No challenge selected</p>
              </CardContent>
            </Card>
          )}

     
          {/* Solution Card */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <FileCheck className="w-5 h-5 text-primary flex-shrink-0" />
                Actual Solution
              </CardTitle>
            </CardHeader>
            <CardContent>
              {team.actual_solution ? (
                <div className="bg-muted/50 p-4 rounded-md">
                  <p className="text-muted-foreground break-words leading-relaxed">
                    {team.actual_solution}
                  </p>
                </div>
              ) : (
                <p className="text-muted-foreground italic">No solution provided yet</p>
              )}
            </CardContent>
          </Card>

          {/* Comments & Notes Card */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <MessageCircle className="w-5 h-5 text-primary flex-shrink-0" />
                Additional Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 flex-shrink-0" />
                    Comment
                  </h4>
                  {team.comment ? (
                    <p className="text-muted-foreground bg-green-50 dark:bg-green-950/20 p-3 rounded-md break-words">
                      {team.comment}
                    </p>
                  ) : (
                    <p className="text-muted-foreground italic">No comment provided</p>
                  )}
                </div>

                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4 flex-shrink-0" />
                    Notes
                  </h4>
                  {team.nots ? (
                    <p className="text-muted-foreground bg-yellow-50 dark:bg-yellow-950/20 p-3 rounded-md break-words">
                      {team.nots}
                    </p>
                  ) : (
                    <p className="text-muted-foreground italic">No notes available</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Stats & Info - Responsive */}
        <div className="space-y-4 sm:space-y-6">
          {/* Team Stats Card */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Trophy className="w-5 h-5 text-primary flex-shrink-0" />
                Team Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm sm:text-base">Members Count</span>
                <Badge variant="default" className="text-xs">
                  {team.members_count} Members
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm sm:text-base">Team Rating</span>
                {team.team_rating ? (
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-semibold">{team.team_rating}</span>
                  </div>
                ) : (
                  <span className="text-muted-foreground italic text-sm">Not rated</span>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm sm:text-base">Total Score</span>
                {team.total_score ? (
                  <span className="font-semibold">{team.total_score}</span>
                ) : (
                  <span className="text-muted-foreground italic text-sm">No score</span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm sm:text-base">Limited Capacity</span>
                <Badge variant={team.limited_capacity ? "destructive" : "default"} className="text-xs">
                  {team.limited_capacity ? "Yes" : "No"}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm sm:text-base">Previous Participants</span>
                <Badge variant={team.members_participated_before ? "default" : "secondary"} className="text-xs">
                  {team.members_participated_before ? "Yes" : "No"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Mentorship Card */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <HelpCircle className="w-5 h-5 text-primary flex-shrink-0" />
                Mentorship Needed
              </CardTitle>
            </CardHeader>
            <CardContent>
              {team.mentorship_needed ? (
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold break-words">{team.mentorship_needed.title}</h3>
                    {/* <p className="text-sm text-muted-foreground">ID: {team.mentorship_needed.id}</p> */}
                  </div>
                  {team.mentorship_needed.extra_field && (
                    <p className="text-muted-foreground text-sm bg-muted/50 p-3 rounded-md break-words">
                      {team.mentorship_needed.extra_field}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground italic">No mentorship requested</p>
              )}
            </CardContent>
          </Card>

          {/* Participation Method Card */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
                Participation Method
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-muted-foreground capitalize">{team.participation_method_id.title} Method</p>
              </div>
              {team.participation_method_id.extra_field && (
                <p className="text-muted-foreground text-sm bg-muted/50 p-3 rounded-md break-words">
                  {team.participation_method_id.extra_field}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Timeline Card */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Clock className="w-5 h-5 text-primary flex-shrink-0" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0 text-sm">
                <span className="text-muted-foreground">Submission Date</span>
                <span className="font-medium break-words">{formatDate(team.submission_date)}</span>
              </div>
              {team.team_leader_id && (
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0 text-sm">
                  <span className="text-muted-foreground">Leader Joined</span>
                  <span className="font-medium break-words">{formatDate(team.team_leader_id.created_at)}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
