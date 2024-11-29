import { Controller, Get, HttpStatus, Inject, Query, UseGuards } from '@nestjs/common';
import { DASHBOARD_SERVICE_TOKEN } from './dashboard.service';
import { IDashboardService } from './interfaces/dashboardService.interface';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AdminDashboardDto } from './dto/adminDashboard.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { ResearcherDashboardDto, ResearcherDashboardQueryDto } from './dto/researcherDashboard.dto';
import { ProcurementOfficerDashboardDto, ProcurementOfficerDashboardQueryDto } from './dto/procurementOficcerdashboard.dto';

const ROUTE = 'dashboard';

@ApiTags(ROUTE)
@Controller(ROUTE)
export class DashboardController {
  constructor(@Inject(DASHBOARD_SERVICE_TOKEN) private readonly dashboardService: IDashboardService) {}

  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, type: () => AdminDashboardDto })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Get('/admin')
  async adminDashboard() {
    return await this.dashboardService.adminDashboard();
  }

  @ApiBearerAuth()
  @ApiQuery({ type: () => ResearcherDashboardQueryDto })
  @ApiResponse({ status: HttpStatus.OK, type: () => ResearcherDashboardDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Researcher)
  @Get('/researcher')
  async researcherDashboard(@Query() query: ResearcherDashboardQueryDto) {
    const { year, month } = query;
    const todayYear = new Date().getFullYear();
    const todayMonth = new Date().getMonth() + 1;
    return await this.dashboardService.researcherDashboard(year ?? todayYear, month ?? todayMonth);
  }

  @ApiBearerAuth()
  @ApiQuery({ type: () => ProcurementOfficerDashboardQueryDto })
  @ApiResponse({ status: HttpStatus.OK, type: () => ProcurementOfficerDashboardDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ProcurementOfficer)
  @Get('/procurement_officer')
  async procurementOfficerDashboard(@Query() query: ProcurementOfficerDashboardQueryDto) {
    const { year, month } = query;
    const todayYear = new Date().getFullYear();
    const todayMonth = new Date().getMonth() + 1;
    return await this.dashboardService.procurementOficcerDashboard(year ?? todayYear, month ?? todayMonth);
  }
}
