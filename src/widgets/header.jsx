import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/shared/ui/breadcrumb';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import { projectsInfo, projectsInfoEntries } from '@/shared/constants';
import { usePathname } from 'next/navigation';

export function AppHeader({ variant }) {
  const pathname = usePathname();
  const lastPart = pathname.substring(pathname.lastIndexOf('/') + 1);

  return (
    <div className="p-6 absolute z-10 m-auto flex justify-center w-[100vw] backdrop-blur">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link href="/">Home</Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1">
                <div>Projects</div>
                <span className="sr-only">Toggle menu</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {projectsInfo.map((project) => (
                  <Link href={project.href ?? '#'} key={'dd-' + project.name}>
                    <DropdownMenuItem className="cursor-pointer">
                      {project.name}
                    </DropdownMenuItem>
                  </Link>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>
              {projectsInfoEntries[lastPart].name}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
