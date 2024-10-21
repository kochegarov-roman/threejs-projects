import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import Video from "@/components/ui/video";
import {projectsInfo} from "@/shared/constants";

export const Projects = () => {
  return (
    projectsInfo.map((project) =>
      <Card className="w-[350px] relative overflow-hidden" key={project.name}>
        <CardHeader>
          <CardTitle>{project.name}</CardTitle>
          <CardDescription>{project.tags.join(", ")}</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Video
            src={"/" + project.src}
            width="640"
            height="360"
            autoplay={true}
            loop={true}
          />
        </CardContent>
        <CardFooter className="flex justify-between absolute bottom-0 w-[100%]">
          {project.href && <Button variant="ghost">Code</Button>}
          <Button variant="outline">Show</Button>
        </CardFooter>
      </Card>
  ));
};