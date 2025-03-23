import ImageCircles from "./components/ui/ImageProcess/ImageCircles"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import WebcamCircles from "./components/ui/ImageProcess/WebcamCircles"


const App = () => {
  return (
    <div>
      <Tabs defaultValue="Image" className="w-full">
        <TabsList>
          <TabsTrigger value="Image">Image</TabsTrigger>
          <TabsTrigger value="Webcam">Webcam</TabsTrigger>
        </TabsList>
        <TabsContent value="Image"><ImageCircles /></TabsContent>
        <TabsContent value="Webcam"><WebcamCircles/></TabsContent>
      </Tabs>
      
    </div>
  )
}

export default App