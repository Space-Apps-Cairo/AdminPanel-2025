import React from 'react'
import EmailGenerator from '../_components/generator'

export default function EditEmailTemplate({params}: {params :{id:string}}) {
  return (
    <div>
      <EmailGenerator mode="edit" email={"doaa"} />
    </div>
  )
}
