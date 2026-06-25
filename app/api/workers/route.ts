import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import { Worker } from '@/lib/services/mockData'

const dataFilePath = path.join(process.cwd(), 'lib/data/workers.json')

export async function GET() {
  try {
    const fileContent = await fs.readFile(dataFilePath, 'utf-8')
    const workers: Worker[] = JSON.parse(fileContent)
    return NextResponse.json(workers)
  } catch (error) {
    console.error('Error reading workers data:', error)
    return NextResponse.json({ error: 'Failed to fetch workers' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const newWorkerData = await request.json()
    
    const fileContent = await fs.readFile(dataFilePath, 'utf-8')
    const workers: Worker[] = JSON.parse(fileContent)
    
    const newWorker: Worker = {
      id: `w${Date.now()}`,
      ...newWorkerData,
      rating: newWorkerData.rating || 0,
      kycVerified: newWorkerData.kycVerified || false,
      completedProjects: newWorkerData.completedProjects || 0,
      reliabilityScore: newWorkerData.reliabilityScore || 100,
      status: newWorkerData.status || 'available'
    }
    
    workers.push(newWorker)
    
    await fs.writeFile(dataFilePath, JSON.stringify(workers, null, 2))
    
    return NextResponse.json(newWorker, { status: 201 })
  } catch (error) {
    console.error('Error adding worker:', error)
    return NextResponse.json({ error: 'Failed to add worker' }, { status: 500 })
  }
}
