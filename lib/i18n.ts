import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { projectRegisterTranslations } from './translations/project-register'
import { projectTranslations } from './translations/projects'
import { subsidyManagementTranslations } from './translations/subsidy-management'

// Recursos de tradução
const resources = {
  en: {
    translation: {
      ...projectTranslations.en,
      dashboard: {
        title: "General Dashboard",
        subtitle: "Overview of key system metrics",
        growth_chart_title: "Growth of Institutions & Churches",
        users_by_institution_chart_title: "User Distribution by Institution",
        financial_chart_title: "Department Budget vs. Subsidy Requests",
        subsidy_status_chart_title: "Subsidy Request Status",
        events_chart_title: "Event Participation by Type",
        communications_chart_title: "Communication & Message Flow",
        recent_activities: "Recent Activities",
        quick_actions: "Quick Actions"
      },
      privacy: {
        protected_content: "Protected Content",
        contact_admin: "Contact administrator for access"
      },
      activities: {
        modal: {
          title: "Activity Details",
          edit_title: "Edit Activity",
          status: "Status",
          priority: "Priority", 
          category: "Category",
          budget: "Budget",
          subsidy: "Subsidy",
          description: "Description",
          documents: "Documents",
          system_info: "System Information",
          created_at: "Created at",
          updated_at: "Updated at",
          created_by: "Created by",
          updated_by: "Updated by",
          activity_id: "Activity ID",
          total_budget: "Total Budget",
          rich_editor: "Rich Editor",
          click_to_edit: "Click to edit description",
          drop_files: "Drop files here or click to upload",
          supported_formats: "Supports PDF and images up to 10MB",
          no_documents: "No documents attached",
          use_button_above: "Use the button above to add documents",
          save_changes: "Save Changes",
          unsaved_changes: "There are unsaved changes",
          close: "Close",
          tooltips: {
            status: "Current activity status",
            priority: "Activity urgency level", 
            category: "Type of activity",
            subsidy: "Whether this activity is subsidized or not",
            total_requested_amount: "Total amount requested for this activity"
          },
          status_labels: {
            planning: "Planning",
            in_progress: "In Progress",
            completed: "Completed",
            pending_approval: "Pending Approval",
            cancelled: "Cancelled"
          },
          priority_labels: {
            urgent: "Urgent",
            high: "High",
            medium: "Medium",
            low: "Low"
          },
          tag_labels: {
            reform: "Reform",
            equipment: "Equipment",
            materials: "Materials",
            training: "Training",
            travel: "Travel",
            event: "Event",
            transport: "Transport",
            marketing: "Marketing",
            services: "Services",
            feeding: "Feeding",
            accommodation: "Accommodation"
          },
          total_requested_amount: "Total Requested Amount",
          press_enter_to_save: "Press Enter or click outside to save",
          done: "Done",
          no_category: "No category",
          assignees: "Assignees",
          assignees_count: "{{count}} assignees",
          select_assignees: "Select Assignees",
          search_user: "Search user...",
          click_to_add_description: "Click here to add a description...",
          metadata: "Metadata",
          history: "History",
          technical_details: "Technical details and activity metadata",
          change_history: "Activity change history",
          status_options: {
            todo: "To Do",
            in_progress: "In Progress", 
            completed: "Completed",
            on_hold: "On Hold"
          },
          priority_options: {
            urgent: "Urgent",
            high: "High",
            medium: "Medium", 
            low: "Low"
          },
          category_options: {
            reforma: "Reform",
            material: "Material",
            training: "Training"
          },
          subsidy_info: {
            subsidized: "This activity is subsidized",
            not_subsidized: "This activity is not subsidized",
            click_to_toggle: "Click to toggle subsidy status"
          },
          delete: {
            title: "Delete Activity",
            description: "This action will permanently delete the activity and all related data.",
            affected_data: "Affected Data",
            view_consequences: "View Consequences",
            understand_consequences: "I understand the consequences of deleting this activity",
            acknowledge_text: "I acknowledge that all activity data and progress will be permanently lost.",
            type_confirmation: "Type \"DELETE ACTIVITY\" to confirm:",
            confirmation_placeholder: "DELETE ACTIVITY",
            confirmation_text: "delete activity",
            confirmation_help: "Type exactly as shown above to enable the delete button",
            delete_activity: "Delete Activity",
            deleting: "Deleting...",
            consequences: {
              data_loss: "Complete Data Loss",
              data_loss_desc: "All activity information, progress tracking, and metadata will be permanently removed.",
              budget_impact: "Budget Impact",
              budget_impact_desc: "The allocated budget will be returned to the project's available funds.",
              progress_loss: "Progress Tracking Loss",
              progress_loss_desc: "All progress tracking, milestones, and completion records will be lost.",
              documentation_loss: "Documentation Loss",
              documentation_loss_desc: "Any attached documents, notes, or related files will be permanently deleted."
            },
            permanent_warning: {
              title: "This is a permanent action",
              description: "Unlike institutions or users, activities cannot be recovered once deleted. All data will be permanently lost."
            }
          }
        },
        subsidized: "Subsidized",
        budget: "Budget",
        priority: "Priority",
        status: "Status",
        subsidy: "Subsidy",
        toasts: {
          deleting: "Deleting activity...",
          deleted: "Activity deleted successfully",
          delete_failed: "Failed to delete activity"
        },
        table: {
          activity: "Activity",
          category: "Category",
          subsidy_status: "Subsidy",
          budget: "Budget",
          status: "Status",
          priority: "Priority",
          actions: "Actions",
          manage_activity: "Manage Activity",
          remove: "Remove",
          subsidized_tab: "Subsidized",
          non_subsidized_tab: "Not Subsidized",
          no_subsidized_found: "No subsidized activities found",
          no_non_subsidized_found: "No non-subsidized activities found",
          adjust_filters: "Adjust the filters to see more activities.",
          create_first_subsidized: "Start by creating the first subsidized activity for the project.",
          create_first_non_subsidized: "Start by creating the first non-subsidized activity for the project.",
          new_activity: "New Activity",
          clear_filters: "Clear Filters",
          filters_cleared: "Filters cleared"
        },
        logs: {
          no_history: "No change history found",
          fields: {
            status: "Status",
            priority: "Priority",
            name: "Name",
            description: "Description",
            budget_amount: "Budget",
            deadline: "Deadline",
            owner_id: "Assignee",
            is_subsidized: "Subsidized",
            activity_tag: "Category (Legacy)",
            tags: "Categories",
            custom_tags: "Custom Tags"
          },
          values: {
            yes: "Yes",
            no: "No"
          },
          actions: {
            created: "{{user}} created the activity",
            deleted: "{{user}} removed the activity",
            status_changed: "{{user}} changed status from",
            priority_changed: "{{user}} changed priority from",
            budget_updated: "{{user}} updated budget from",
            subsidized_marked: "{{user}} marked as subsidized",
            subsidized_unmarked: "{{user}} unmarked as subsidized",
            field_updated: "{{user}} updated {{field}}",
            from: "from",
            to: "to",
            generic_action: "{{user}} performed an action: {{action}}"
          },
          time: {
            just_now: "Just now",
            minutes_ago: "{{count}}m ago",
            hours_ago: "{{count}}h ago",
            days_ago: "{{count}}d ago"
          }
        },
        user_selector: {
          add_assignees: "Add Assignees",
          select_assignees: "Select Assignees",
          search_user: "Search user...",
          selected: "Selected",
          search_label: "Search User",
          available_users: "Available Users",
          no_user_found: "No user found",
          no_user_available: "No user available",
          selection_count: "{{selected}} of {{max}} user(s) selected",
          cancel: "Cancel",
          confirm: "Confirm ({{count}})"
        },
        documents: {
          title: "Attached Files",
          uploading: "Uploading...",
          upload_files: "Upload {{count}} file(s)",
          files_added: "{{count}} file(s) added",
          files_rejected: "Some files were rejected (only PDF and images up to 10MB)",
          drag_or_click: "Drag files here or click to select",
          supported_formats: "Supported formats: JPG, PNG, PDF (max. 10MB)",
          pending_upload: "Pending upload files:",
          pending_upload_count: "{{count}} files pending upload",
          loading: "Loading documents...",
          uploaded_documents: "Uploaded documents ({{count}}):",
          uploaded_on: "Uploaded on",
          validated: "Validated",
          pending: "Pending",
          download_document: "Download document",
          validate_document: "Validate document",
          delete_confirm: "Are you sure you want to delete this document?",
          delete_document: "Delete document",
          no_documents: "No documents attached yet",
          drag_to_add: "Drag files or click \"Upload\" to add",
          no_files_attached: "No files attached",
          files_will_upload_on_save: "Files will be uploaded automatically when saving",
          uploading_files: "Uploading files...",
          files_uploaded_successfully: "Files uploaded successfully"
        }
      },
      metrics: {
        total_users: "Total Users",
        total_institutions: "Total Institutions",
        total_churches: "Total Churches",
        pending_subsidies: "Pending Subsidies",
        active_regions: "Active Regions",
        monthly_growth: "Monthly Growth",
        budget_utilization: "Budget Utilization",
        event_participation: "Event Participation"
      },
      common: {
        ...projectTranslations.en.common,
        language: "Language",
        english: "English",
        dutch: "Dutch",
        profile: "Profile",
        loading: "Loading...",
        error: "An error occurred",
        success: "Success",
        confirm: "Confirm",
        impact: "Action Impact",
        consequences: "Consequences of this action",
        undone: "This action cannot be undone",
        riskAware: "You are aware of the risks",
        approve: "Approve",
        reject: "Reject",
        cancel: "Cancel",
        save: "Save",
        edit: "Edit",
        delete: "Delete",
        view: "View",
        filter: "Filter",
        search: "Search",
        export: "Export",
        refresh: "Refresh",
        columns: "Columns",
        clear_filters: "Clear Filters",
        close: "Close",
        upload: "Upload",
        active: "Active",
        inactive: "Inactive",
        status: "Status",
        structure_organization: "Structure & Organization",
        members: "Members",
        budget: "Budget",
        actions: "Actions",
        refreshing: "Refreshing...",
        data_refreshed: "Data refreshed",
        error_refreshing: "Error refreshing data",
        annual_budget: "Annual Budget",
        data_loaded: "Data loaded successfully",
        coming_soon: "Coming Soon",
        coming_soon_description: "This feature is under development and will be available soon.",
        theme: "Theme",
        light_mode: "Light",
        dark_mode: "Dark",
        theme_light_activated: "Light mode activated",
        theme_dark_activated: "Dark mode activated",
        invite: "Invite",
        see_all_churches: "See All Churches",
        all_members_associated_with: "All members associated with",
        all_departments_within: "All departments within",
        view_contact: "View Contact",
        add: "Add",
        create: "Create",
        total: "Total",
        apply: "Apply",
        irreversible: "This action cannot be undone",
        deletePermanently: "Delete Permanently",
        registeredUsers: "Registered Users"
      },
      kanban: {
        dropItemHere: "Drop item here",
        noItemsYet: "No items yet",
        addFirstItem: "Add first item",
        addNewGroup: "Add New Group", 
        createNewGroup: "Create a new group",
        createGroup: "Create Group",
        createGroupDescription: "Fill in the details below to create a new group",
        groupName: "Group Name",
        groupNamePlaceholder: "e.g., In Progress, Completed",
        groupDescription: "Description",
        groupDescriptionPlaceholder: "Brief description of this group's purpose",
        groupColor: "Color",
        item: "item",
        items: "items"
      },
      actions: {
        ...projectTranslations.pt.actions,
        add_member: "Adicionar Membro",
        create_event: "Create Event",
        manage_subsidies: "Manage Subsidies",
        view_reports: "View Reports",
        send_communication: "Send Communication",
        manage_departments: "Manage Departments",
        view_details: "View Details",
        create_institution: "Create Institution",
        view: "View",
        edit: "Edit",
        delete: "Delete",
        duplicate: "Duplicate",
        archive: "Archive",
        unarchive: "Unarchive",
        editProject: "Edit Project",
        duplicateProject: "Duplicate Project"
      },
      institutions: {
        title: "Institutions",
        subtitle: "Manage institutions and their relationships",
        overview: "Overview",
        all_institutions: "All Institutions",
        page_header: {
          title: "Institution Overview",
          subtitle: "Complete management interface for institutional structure",
          new_institution: "New Institution"
        },
        entity_info: {
          header_title: "Institution Info",
          active: "Active",
          inactive: "Inactive",
          established: "Est."
        },
        actions: {
          view_contact_details: "View Contact Details",
          manage_churches: "Manage Churches",
          manage_departments: "Manage Departments",
          manage_annual_budgets: "Manage Annual Budgets",
          edit_institution: "Edit Institution",
          delete_institution: "Delete Institution"
        },
        analytics: {
          title: "Institution Analytics"
        },
        table_card: {
          title: "Institutions List",
          description: "Complete list of institutions with management actions"
        },
        filters: {
          institution: "Institution",
          denomination: "Denomination",
          country: "Country",
          language: "Language"
        },
        kpis: {
          total_institutions: "Total Institutions",
          total_regions: "Total Regions",
          total_churches: "Total Churches",
          total_departments: "Total Departments",
          total_users: "Total Users",
          total_budget: "Total Budget",
          annual_budget: "Annual Budget",
          pending_subsidies: "Pending Subsidies",
          budget_utilization: "Budget Utilization"
        },
        charts: {
          churches_by_region: "Churches by Region",
          users_by_role: "Users by Role",
          subsidy_over_time: "Subsidy Requests over Time",
          revenue_vs_budget: "Revenue vs Annual Budget",
          monthly_subsidies: "Monthly Subsidy Trends"
        },
        table: {
          name: "Institution Name",
          country: "Country",
          denomination: "Denomination",
          language: "Language",
          churches: "Churches",
          users: "Users",
          members: "Members",
          regions: "Regions",
          budget: "Budget",
          budget_status: "Budget Status",
          actions: "Actions",
          search_placeholder: "Search institutions...",
          no_results: "No institutions found",
          showing_results: "Showing {{from}} to {{to}} of {{total}} institutions"
        },
        modal: {
          create_title: "Create New Institution",
          edit_title: "Edit Institution",
          basic_info: "Basic Information",
          contact_info: "Contact Information",
          review: "Review",
          name: "Institution Name",
          name_placeholder: "Enter institution name",
          denomination: "Denomination",
          denomination_placeholder: "Select or enter denomination",
          language_preference: "Language Preference",
          country: "Country",
          country_placeholder: "Select country",
          city: "City",
          city_placeholder: "Enter city",
          address: "Address",
          address_placeholder: "Enter full address",
          email: "Email",
          email_placeholder: "Enter contact email",
          phone: "Phone",
          phone_placeholder: "Enter phone number",
          website: "Website",
          website_placeholder: "Enter website URL",
          next: "Next",
          back: "Back",
          create: "Create Institution",
          update: "Update Institution",
          cancel: "Cancel"
        },
        modals: {
          edit: {
            title: "Edit Institution",
            description: "Update institution information and settings"
          },
          delete: {
            deactivate_title: "Deactivate Institution",
            deactivate_description: "This will deactivate the institution and restrict access to all associated users and data.",
            affected_components: "Affected Components",
            view_consequences: "View Consequences",
            understand_consequences: "I understand the consequences of deactivating this institution",
            acknowledge_text: "This action will affect all users, regions, churches, and departments associated with this institution.",
            type_confirmation: "Type 'DELETE INSTITUTION' to confirm:",
            confirmation_placeholder: "DELETE INSTITUTION",
            confirmation_help: "Type exactly as shown above to enable the delete button",
            deactivating: "Deactivating...",
            deactivate_institution: "Deactivate Institution",
            consequences: {
              user_access: "User Access Restriction",
              user_access_desc: "All users associated with this institution will lose access to the system immediately.",
              data_preservation: "Data Preservation",
              data_preservation_desc: "All data including subsidies, reports, and communications will be preserved but marked as inactive.",
              organizational_structure: "Organizational Structure",
              organizational_structure_desc: "All regions, churches, and departments will be deactivated but data will remain intact.",
              financial_data: "Financial Records",
              financial_data_desc: "All budget allocations, subsidy requests, and financial reports will be preserved for audit purposes."
            },
            soft_delete: {
              title: "This is a soft deactivation",
              description: "The institution will be marked as inactive but all data will be preserved. This action can be reversed by a system administrator."
            }
          }
        },
        fields: {
          name: "Institution Name",
          denomination: "Denomination",
          language_preference: "Language Preference"
        },
        placeholders: {
          name: "Enter institution name",
          denomination: "Enter denomination",
          language_preference: "Select preferred language"
        },
        validation: {
          name_required: "Institution name is required",
          name_min_length: "Institution name must be at least 2 characters",
          denomination_required: "Denomination is required",
          language_required: "Language preference is required"
        },
        stats: {
          regions: "Regions",
          churches: "Churches",
          departments: "Departments",
          users: "Users"
        },
        saving: "Saving...",
        toasts: {
          loaded: "Institutions data loaded successfully",
          error_loading: "Error loading institutions data",
          institution_details_loaded: "Institution details loaded",
          institution_switched: "Institution filter changed",
          create_success: "Institution created successfully",
          create_error: "Error creating institution",
          update_success: "Institution updated successfully",
          update_error: "Error updating institution",
          delete_success: "Institution deleted successfully",
          delete_error: "Error deleting institution",
          language_switched: "Language switched successfully",
          updating: "Updating institution...",
          updated: "Institution updated successfully",
          update_failed: "Failed to update institution",
          deactivating: "Deactivating institution...",
          deactivated: "Institution deactivated successfully",
          deactivate_failed: "Failed to deactivate institution",
          image_uploading: "Uploading image...",
          image_uploaded: "Image uploaded successfully",
          image_upload_failed: "Failed to upload image",
          image_removing: "Removing image...",
          image_removed: "Image removed successfully",
          image_remove_failed: "Failed to remove image",
          created: "Institution created successfully",
          refreshing_data: "Refreshing data...",
          data_refreshed: "Data refreshed successfully",
          error_refreshing_data: "Error refreshing data",
          no_institution_selected: "No institution selected"
        }
      },
      regions: {
        title: "Regions",
        subtitle: "Manage regional divisions and territories",
        modals: {
          create: {
            title: "Add New Region",
            description: "Create a new regional division for your institution"
          },
          edit: {
            title: "Edit Region",
            description: "Update region information and settings"
          },
          delete: {
            deactivate_title: "Deactivate Region",
            deactivate_description: "This will deactivate the region and make it inaccessible to users. The region data will be preserved.",
            view_consequences: "View Consequences",
            understand_consequences: "I understand the consequences",
            acknowledge_text: "I acknowledge that this action will affect churches and related data.",
            type_confirmation: "Type 'delete region' to confirm",
            confirmation_placeholder: "delete region",
            confirmation_help: "This action cannot be undone. Type the exact text to confirm.",
            deactivating: "Deactivating...",
            deactivate_region: "Deactivate Region",
            affected_components: "Affected Components",
            consequences: {
              church_access: "Church Access Loss",
              church_access_desc: "Churches in this region will lose access to regional resources and coordination.",
              data_preservation: "Data Preservation",
              data_preservation_desc: "All region data, budgets, and church information will be preserved but hidden.",
              member_impact: "Member Impact",
              member_impact_desc: "Regional members will be reassigned to other regions or marked as unassigned.",
              event_impact: "Event Impact",
              event_impact_desc: "Regional events will be cancelled and new events cannot be created."
            },
            soft_delete: {
              title: "Soft Delete",
              description: "The region will be deactivated but not permanently deleted. All data will be preserved and can be restored if needed."
            }
          }
        },
        sections: {
          basic_info: "Basic Information",
          contact_info: "Contact Information"
        },
        fields: {
          name: "Region Name",
          parent_region: "Parent Region",
          contact_name: "Contact Name",
          contact_email: "Contact Email",
          contact_phone: "Contact Phone",
          contact_mobile: "Contact Mobile",
          contact_country: "Country",
          contact_city: "City",
          contact_address: "Address",
          contact_postal_code: "Postal Code",
          contact_website: "Website"
        },
        placeholders: {
          name: "Enter region name",
          parent_region: "Select parent region",
          no_parent: "No parent region (top-level)",
          country: "Select country",
          contact_name: "Enter contact name",
          contact_email: "Enter contact email",
          contact_phone: "Enter phone number",
          contact_mobile: "Enter mobile number",
          contact_country: "Enter country",
          contact_city: "Enter city",
          contact_address: "Enter address",
          contact_postal_code: "Enter postal code",
          contact_website: "https://example.com"
        },
        labels: {
          region: "Region",
          contact: "Contact"
        },
        steps: {
          step: "Step",
          of: "of"
        },
        buttons: {
          next: "Next",
          previous: "Previous"
        },
        validation: {
          name_required: "Region name is required",
          name_min_length: "Region name must be at least 2 characters",
          email_invalid: "Please enter a valid email address",
          please_fix_errors: "Please fix the errors before continuing"
        },
        creating: "Creating...",
        updating: "Updating...",
        stats: {
          churches: "Churches",
          members: "Members",
          budget: "Budget",
          utilization: "Utilization"
        },
        toasts: {
          creating: "Creating region...",
          created: "Region created successfully",
          create_failed: "Failed to create region",
          updating: "Updating region...",
          updated: "Region updated successfully",
          update_failed: "Failed to update region",
          deactivating: "Deactivating region...",
          deactivated: "Region deactivated successfully",
          deactivate_failed: "Failed to deactivate region"
        }
      },
      churches: {
        title: "Churches",
        subtitle: "Manage churches and their organization",
        church: "Church",
        active_churches: "Active churches",
        modals: {
          create: {
            title: "Add New Church",
            description: "Create a new church for your institution"
          },
          edit: {
            title: "Edit Church",
            description: "Update church information and settings"
          },
          delete: {
            deactivate_title: "Deactivate Church",
            deactivate_description: "This will deactivate the church and make it inaccessible to users. The church data will be preserved.",
            view_consequences: "View Consequences",
            understand_consequences: "I understand the consequences",
            acknowledge_text: "I acknowledge that this action will affect church members and related data.",
            type_confirmation: "Type 'delete church' to confirm",
            confirmation_placeholder: "delete church",
            confirmation_help: "This action cannot be undone. Type the exact text to confirm.",
            deactivating: "Deactivating...",
            deactivate_church: "Deactivate Church",
            affected_components: "Affected Components",
            consequences: {
              member_access: "Member Access Loss",
              member_access_desc: "Church members will lose access to church resources and activities.",
              data_preservation: "Data Preservation",
              data_preservation_desc: "All church data, budgets, and project information will be preserved but hidden.",
              department_impact: "Department Impact",
              department_impact_desc: "Church departments will be deactivated and unavailable for new activities.",
              event_impact: "Event Impact",
              event_impact_desc: "Scheduled events will be cancelled and new events cannot be created."
            },
            soft_delete: {
              title: "Soft Delete",
              description: "The church will be deactivated but not permanently deleted. All data will be preserved and can be restored if needed."
            }
          }
        },
        sections: {
          basic_info: "Basic Information",
          contact_info: "Contact Information"
        },
        fields: {
          name: "Church Name",
          region: "Region",
          contact_name: "Contact Name",
          contact_email: "Contact Email",
          contact_phone: "Contact Phone",
          contact_mobile: "Contact Mobile",
          contact_country: "Country",
          contact_city: "City",
          contact_address: "Address",
          contact_postal_code: "Postal Code",
          contact_website: "Website"
        },
        placeholders: {
          name: "Enter church name",
          region: "Select region",
          contact_name: "Enter contact name",
          contact_email: "Enter contact email",
          contact_phone: "Enter phone number",
          contact_mobile: "Enter mobile number",
          contact_country: "Enter country",
          contact_city: "Enter city",
          contact_address: "Enter address",
          contact_postal_code: "Enter postal code",
          contact_website: "https://example.com"
        },
        labels: {
          church: "Church",
          contact: "Contact"
        },
        steps: {
          step: "Step",
          of: "of"
        },
        buttons: {
          next: "Next",
          previous: "Previous"
        },
        validation: {
          name_required: "Church name is required",
          name_min_length: "Church name must be at least 2 characters",
          region_required: "Region is required",
          email_invalid: "Please enter a valid email address",
          please_fix_errors: "Please fix the errors before continuing"
        },
        creating: "Creating...",
        updating: "Updating...",
        stats: {
          members: "Members",
          departments: "Departments",
          budget: "Budget",
          events: "Events"
        },
        toasts: {
          creating: "Creating church...",
          created: "Church created successfully",
          create_failed: "Failed to create church",
          updating: "Updating church...",
          updated: "Church updated successfully",
          update_failed: "Failed to update church",
          deactivating: "Deactivating church...",
          deactivated: "Church deactivated successfully",
          deactivate_failed: "Failed to deactivate church"
        }
      },
      departments: {
        title: "Departments",
        subtitle: "Manage departments and their organization",
        modals: {
          create: {
            title: "Add New Department",
            description: "Create a new department for your institution"
          },
          edit: {
            title: "Edit Department",
            description: "Update department information and settings"
          },
          delete: {
            deactivate_title: "Deactivate Department",
            deactivate_description: "This will deactivate the department and make it inaccessible to users. The department data will be preserved.",
            view_consequences: "View Consequences",
            understand_consequences: "I understand the consequences",
            acknowledge_text: "I acknowledge that this action will affect department members and related data.",
            type_confirmation: "Type 'delete department' to confirm",
            confirmation_placeholder: "delete department",
            confirmation_text: "delete department",
            confirmation_help: "This action will temporarily deactivate the department. It can be reactivated later if needed.",
            deactivating: "Deactivating...",
            deactivate_department: "Deactivate Department",
            affected_components: "Affected Components",
            consequences: {
              member_access: "Member Access Loss",
              member_access_desc: "Department members will lose access to department resources and activities.",
              data_preservation: "Data Preservation",
              data_preservation_desc: "All department data, budgets, and project information will be preserved but hidden.",
              budget_impact: "Budget Impact",
              budget_impact_desc: "Department budget allocations will be frozen and unavailable for new projects.",
              project_impact: "Project Impact",
              project_impact_desc: "Active projects will be suspended and new projects cannot be created."
            },
            soft_delete: {
              title: "Soft Delete",
              description: "The department will be deactivated but not permanently deleted. All data will be preserved and can be restored if needed."
            }
          }
        },
        sections: {
          basic_info: "Basic Information",
          contact_info: "Contact Information"
        },
        fields: {
          name: "Department Name",
          church: "Church",
          description: "Description",
          annual_budget: "Annual Budget",
          contact_name: "Contact Name",
          contact_email: "Contact Email",
          contact_phone: "Contact Phone",
          contact_mobile: "Contact Mobile",
          contact_country: "Country",
          contact_city: "City",
          contact_address: "Address",
          contact_postal_code: "Postal Code",
          contact_website: "Website"
        },
        placeholders: {
          name: "Enter department name",
          church: "Select church",
          description: "Enter department description",
          annual_budget: "Enter annual budget amount",
          contact_name: "Enter contact name",
          contact_email: "Enter contact email",
          contact_phone: "Enter phone number",
          contact_mobile: "Enter mobile number",
          contact_country: "Enter country",
          contact_city: "Enter city",
          contact_address: "Enter address",
          contact_postal_code: "Enter postal code",
          contact_website: "https://example.com"
        },
        labels: {
          department: "Department",
          contact: "Contact"
        },
        steps: {
          step: "Step",
          of: "of"
        },
        buttons: {
          next: "Next",
          previous: "Previous"
        },
        validation: {
          name_required: "Department name is required",
          name_min_length: "Department name must be at least 2 characters",
          church_required: "Church is required",
          description_required: "Description is required",
          description_min_length: "Description must be at least 10 characters",
          budget_required: "Annual budget is required and must be greater than 0",
          email_invalid: "Please enter a valid email address",
          please_fix_errors: "Please fix the errors before continuing"
        },
        creating: "Creating...",
        updating: "Updating...",
        stats: {
          church: "Church",
          members: "Members",
          budget: "Budget",
          projects: "Projects"
        },
        actions: {
          view_details: "View Details",
          edit_department: "Edit Department",
          manage_budget: "Manage Budget",
          delete_department: "Delete Department"
        },
        kpi: {
          budget_total: {
            title: "Budget Total",
            subtitle: "Total planned budget"
          },
          spent_amount: {
            title: "Spent Amount",
            subtitle: "Total expenses"
          },
          members: {
            title: "Members",
            subtitle: "Department members"
          }
        },
        detail: {
          info_card: {
            header_title: "Department Info",
            no_description: "No description available",
            institutional: "Institutional",
            active: "Active",
            inactive: "Inactive"
          }
        },
        toasts: {
          creating: "Creating department...",
          created: "Department created successfully",
          create_failed: "Failed to create department",
          updating: "Updating department...",
          updated: "Department updated successfully",
          update_failed: "Failed to update department",
          deactivating: "Deactivating department...",
          deactivated: "Department deactivated successfully",
          deactivate_failed: "Failed to deactivate department"
        },
        analytics: "Analytics",
        utilization: "Utilization",
        budget_remaining: "Budget Remaining",
        requests: "Requests",
        table_title: "Departments",
        table_description: "Complete list of departments with management actions",
        create_department: "Create Department",
        edit_department: "Edit Department",
        delete_department: "Delete Department"
      },
      access: {
        title: "Access Management",
        subtitle: "Manage users, roles, and permissions",
        overview: "Access Overview",
        kpis: {
          total_users: "Total Users",
          total_roles: "Total Roles",
          total_permissions: "Total Permissions",
          active_users: "Active Users",
          admin_users: "Admin Users",
          user_growth_rate: "User Growth Rate"
        },
        charts: {
          role_distribution: "Role Distribution",
          permissions_by_group: "Permissions by Group",
          user_activity: "User Activity Over Time"
        },
        tabs: {
          users: "Users",
          roles: "Roles",
          permissions: "Permissions"
        },
        users: {
          title: "User Management",
          subtitle: "Manage system users and their access",
          table: {
            name: "Name",
            email: "Email",
            institution: "Institution",
            church: "Church",
            roles: "Roles",
            created_at: "Created",
            actions: "Actions",
            search_placeholder: "Search users...",
            no_results: "No users found"
          },
          actions: {
            create_user: "Create User",
            view_details: "View Details",
            edit_user: "Edit User",
            assign_role: "Assign Role",
            remove_role: "Remove Role",
            delete_user: "Delete User"
          }
        },
        roles: {
          title: "Role Management",
          subtitle: "Manage roles and their permissions",
          table: {
            name: "Role Name",
            key_code: "Key Code",
            description: "Description",
            permissions_count: "Permissions",
            users_count: "Users",
            actions: "Actions",
            type: "Type"
          },
          actions: {
            create_role: "Create Role",
            edit_role: "Edit Role",
            edit_permissions: "Edit Permissions",
            duplicate_role: "Duplicate Role",
            delete_role: "Delete Role"
          },
          permissions: {
            title: "Role Permissions Configuration",
            subtitle: "Configure detailed permissions for this role",
            role_info: "Role Information",
            permissions_matrix: "Permissions Matrix",
            select_all: "Select All Permissions",
            select_none: "Clear All Permissions",
            select_group: "Select All in Group",
            clear_group: "Clear Group",
            selected_count: "{{count}} permissions selected",
            total_permissions: "{{total}} total permissions",
            unsaved_changes: "You have unsaved changes",
            groups: {
              USER: "User Management",
              ROLE: "Role Management", 
              PERMISSION: "Permission Management",
              INSTITUTION: "Institution Management",
              REGION: "Region Management",
              CHURCH: "Church Management"
            },
            group_descriptions: {
              USER: "Control user creation, editing, and access management",
              ROLE: "Manage system roles and role assignments",
              PERMISSION: "Configure system-wide permission settings",
              INSTITUTION: "Administer institutions and organizational structure",
              REGION: "Manage regional divisions and territories",
              CHURCH: "Oversee church operations and management"
            }
          }
        },
        permissions: {
          title: "System Permissions",
          subtitle: "View all available system permissions",
          table: {
            name: "Permission Name",
            key_code: "Key Code",
            description: "Description",
            group: "Group"
          }
        },
        modals: {
          create_user: {
            title: "Create New User",
            name: "Full Name",
            email: "Email Address",
            institution: "Institution",
            church: "Church",
            language: "Language Preference",
            roles: "Assign Roles",
            create: "Create User",
            cancel: "Cancel"
          },
          create_role: {
            title: "Create New Role",
            description: "Create a new role with specific permissions for system access",
            name: "Role Name",
            name_placeholder: "Enter role name (e.g., Manager, Editor)",
            key_code: "Key Code",
            key_code_placeholder: "Enter unique key (e.g., MANAGER)",
            description_label: "Description",
            description_placeholder: "Describe what this role can do...",
            permissions_note: "You can assign permissions after creating the role",
            create: "Create Role"
          },
          edit_role: {
            title: "Edit Role",
            description: "Modify role details and manage permissions",
            name: "Role Name",
            key_code: "Key Code",
            description_label: "Description",
            permissions: "Permissions",
            admin_key_locked: "Admin key code cannot be modified for security reasons",
            edit_permissions: "Edit Permissions",
            save: "Save Changes",
            cancel: "Cancel"
          },
          delete_role: {
            title: "Delete Role",
            description: "This action cannot be undone. The role will be permanently deleted.",
            reassign_description: "This role is assigned to users. You must reassign them first.",
            reassign_to: "Reassign users to",
            select_role: "Select a replacement role",
            reassign_warning: "Important: User permissions will change",
            reassign_note: "Users will inherit the permissions of the new role immediately",
            confirm_warning: "Are you absolutely sure?",
            confirm_note: "This role and all its associations will be permanently deleted",
            skip_reassign: "Delete Without Reassigning",
            reassign_and_delete: "Reassign & Delete Role",
            delete: "Delete Role"
          }
        },
        toasts: {
          user_created: "User created successfully",
          user_updated: "User updated successfully",
          user_deleted: "User deleted successfully",
          role_created: "Role created successfully",
          role_updated: "Role updated successfully",
          role_deleted: "Role deleted successfully",
          role_assigned: "Role assigned successfully",
          role_removed: "Role removed successfully",
          permissions_updated: "Permissions updated successfully",
          access_denied: "Access denied - insufficient permissions",
          creating_role: "Creating role...",
          updating_role: "Updating role...",
          deleting_role: "Deleting role...",
          role_create_failed: "Failed to create role",
          role_update_failed: "Failed to update role",
          role_delete_failed: "Failed to delete role"
        }
      },
      users: {
        title: "User Management",
        subtitle: "Manage system users, roles, and permissions",
        overview: "Users Overview",
        registered_users: "Registered users",
        loading: "Loading users data...",
        loaded: "Users data loaded successfully!",
        load_error: "Failed to load users data",
        refreshing: "Refreshing data...",
        refreshed: "Data refreshed successfully!",
        refresh_error: "Failed to refresh data",
        kpis: {
          total_users: "Total Users",
          active_users: "Active Users",
          inactive_users: "Inactive Users",
          new_users_month: "New This Month",
          deleted_users: "Deleted Users",
          total_users_description: "All registered users",
          of_total: "of total",
          new_users_month_description: "Recently joined",
          deleted_users_description: "Soft deleted users"
        },
        charts: {
          users_by_role: "Users by Role",
          users_by_role_description: "Role distribution across users",
          users_by_institution: "Users by Institution",
          users_by_institution_description: "User count per institution",
          user_growth: "User Growth",
          user_growth_description: "Monthly user registration trend",
          users_by_region: "Users by Region",
          users_by_region_description: "Regional user distribution",
          users_by_department: "Users by Department",
          users_by_department_description: "Department user allocation"
        },
        table: {
          title: "All Users",
          description: "Manage and view all system users",
          total_found: "users found",
          avatar: "Avatar",
          name: "Name",
          email: "Email",
          language: "Language",
          institution: "Institution",
          church: "Church",
          department: "Department",
          department_type: "Department Type",
          roles: "Roles",
          status: "Status",
          actions: "Actions",
          search_placeholder: "Search users...",
          no_results: "No users found",
          no_users: "No users found",
          active: "Active",
          inactive: "Inactive",
          gender: "Gender",
          no_role: "No Role",
        },
        filters: {
          institution: "Institution",
          church: "Church",
          department_type: "Department Type",
          status: "Status",
          church_departmental: "Church Departmental",
          institutional_departmental: "Institutional Departmental",
          no_departmental: "No Departmental"
        },
        details: {
          language: "Language",
          user_id: "User ID",
          institution: "Institution",
          church: "Church",
          created: "Created",
          updated: "Updated"
        },
        gender: {
          MALE: "Male",
          FEMALE: "Female",
        },
        actions: {
          create_user: "Create User",
          edit_user: "Edit User",
          delete_user: "Delete User",
          view_details: "View Details",
          view_contact: "View Contact",
          assign_roles: "Assign Roles",
          activate_user: "Activate User",
          deactivate_user: "Deactivate User"
        },
        modals: {
          create_user: {
            title: "Create New User",
            description: "Add a new user to the system",
            name: "Full Name",
            name_placeholder: "Enter user's full name",
            email: "Email Address",
            email_placeholder: "Enter email address",
            language: "Language Preference",
            institution: "Institution",
            church: "Church",
            region: "Region",
            department: "Department (Optional)",
            roles: "Assign Roles",
            status: "User Status",
            create: "Create User",
            cancel: "Cancel"
          },
          edit_user: {
            title: "Edit User",
            description: "Update user information and permissions",
            // Form fields
            fields: {
              name: "Name",
              email: "Email",
              language_preference: "Language Preference",
              gender: "Gender",
              male: "Male",
              female: "Female",
              status: "Status",
              active: "Active",
              inactive: "Inactive",
              institution: "Institution",
              church: "Church",
              department: "Department",
              roles: "Roles"
            },
            // Step descriptions
            steps: {
              personal_info: "Personal Information",
              personal_info_description: "Enter basic user details",
              organizational_info: "Organizational Information",
              organizational_info_description: "Select institution, church and department (optional)",
              assign_roles: "Assign Roles",
              assign_roles_description: "Select one or more roles for this user"
            },
            // Status messages
            status: {
              active_description: "User has access to the system",
              inactive_description: "User loses access to the system",
              part_of_department: "Part of a Department?",
              part_of_department_description: "Is this user part of any department?",
              no_church_departments: "No church departments available",
              no_institutional_departments: "No institutional departments available",
              no_roles_assigned: "No roles assigned"
            },
            // Department tabs
            departments: {
              church_departments: "Church Departments",
              institutional_departments: "Institutional Departments"
            },
            // Role categories
            categories: {
              all: "All",
              administration: "Administration",
              church: "Church",
              institutional: "Institutional",
              leadership: "Leadership",
              member: "Member"
            },
            // Buttons
            buttons: {
              back: "Back",
              cancel: "Cancel",
              continue: "Continue",
              update_user: "Update User",
              updating: "Updating..."
            },
            // Progress
            progress: {
              step: "Step",
              of: "of",
              percent: "%"
            },
            // Error messages
            errors: {
              name_required: "Name is required",
              email_required: "Email is required",
              language_required: "Language is required",
              institution_required: "Institution is required",
              department_required: "Please select a department",
              roles_required: "Please assign at least one role",
              fill_all_fields: "Please fill in all required fields"
            },
            // Success messages
            toasts: {
              updating_user: "Updating user...",
              user_updated: "User updated successfully",
              user_update_failed: "Failed to update user"
            },
            // Placeholders
            placeholders: {
              select_language: "Select language",
              select_institution: "Select institution",
              select_church: "Select church",
              search_departments: "Search departments...",
              search_roles: "Search roles..."
            },
            // Filter labels
            filters: {
              filter_by_category: "Filter by Category"
            },
            save: "Save Changes"
          },
          delete_user: {
            title: "Delete User",
            description: "This action cannot be undone. The user will be soft deleted.",
            confirm_warning: "Are you sure you want to delete this user?",
            confirm_note: "The user will be deactivated and marked as deleted",
            delete: "Delete User",
            deactivate_title: "Deactivate User Access",
            deactivate_description: "This action will remove the user's access to the system while preserving all data",
            view_consequences: "View Consequences",
            understand_consequences: "I understand the consequences",
            acknowledge_text: "I acknowledge that this user will lose access to the system and all associated privileges",
            type_confirmation: "Type \"DELETE USER\" to confirm this action:",
            confirmation_placeholder: "DELETE USER",
            confirmation_help: "This confirmation ensures you understand the action being performed",
            deactivate_user: "Deactivate User",
            deactivating: "Deactivating...",
            consequences: {
              login_access: "Login Access Revoked",
              login_access_desc: "User will no longer be able to authenticate or access the system",
              data_preservation: "Data Preservation", 
              data_preservation_desc: "All historical records, subsidies, and reports will be preserved",
              role_assignments: "Role Assignments",
              role_assignments_desc: "All role assignments will be suspended but can be restored"
            },
            soft_delete: {
              title: "Soft Delete Operation",
              description: "This is a reversible operation. The user account will be marked as inactive, preventing system access while maintaining all data integrity. The account can be reactivated at any time by an administrator."
            }
          },
          user_details: {
            title: "User Details",
            description: "Complete user information and history",
            basic_info: "Basic Information",
            contact_info: "Contact Information",
            system_info: "System Information",
            roles_permissions: "Roles & Permissions",
            history: "History"
          }
        },
        toasts: {
          user_created: "User created successfully",
          user_updated: "User updated successfully",
          user_deleted: "User deleted successfully",
          user_activated: "User activated successfully",
          user_deactivated: "User deactivated successfully",
          role_assigned: "Role assigned successfully",
          role_removed: "Role removed successfully",
          creating_user: "Creating user...",
          updating_user: "Updating user...",
          deleting_user: "Deleting user...",
          user_create_failed: "Failed to create user",
          user_update_failed: "Failed to update user",
          user_delete_failed: "Failed to delete user"
        },
        profile: {
          title: "User Profile",
          subtitle: "Complete user information and activity overview",
          analytics: {
            title: "Activity Analytics",
            subtitle: "Track user activity trends over time",
            subsidy_trends: "Subsidy Request Trends",
            subsidy_description: "Monthly subsidy request activity",
            event_trends: "Event Participation Trends", 
            event_description: "Monthly event registration and attendance",
            report_trends: "Report Submission Trends",
            report_description: "Quarterly and annual report submissions",
            communication_trends: "Communication Activity Trends",
            communication_description: "Monthly communication patterns"
          },
          sections: {
            personal_info: "Personal Information",
            system_access: "System Access",
            quick_actions: "Quick Actions",
            recent_activity: "Recent Activity",
            organizational_context: "Organizational Context"
          },
          stats: {
            subsidies: "Subsidies",
            events: "Events", 
            communications: "Communications",
            reports: "Reports",
            total_requests: "Total Requests",
            approved: "Approved",
            registered: "Registered",
            upcoming: "Upcoming",
            total: "Total",
            authored: "Authored",
            annual_reports: "Annual Reports",
            department: "Department"
          },
          actions: {
            send_message: "Send Message",
            view_subsidies: "View Subsidies",
            view_events: "View Events", 
            view_communications: "View Communications",
            view_reports: "View Reports",
            view_contact: "View Contact",
            edit_user: "Edit User",
            delete_user: "Delete User",
            back_to_users: "Back to Users"
          },
          tabs: {
            subsidies: "Subsidies",
            events: "Events",
            reports: "Reports",
            communications: "Communications"
          },
          tables: {
            recent_subsidies: "Recent Subsidy Requests",
            recent_events: "Recent Event Registrations",
            recent_reports: "Recent Report Submissions", 
            recent_communications: "Recent Communications",
            description: "Description",
            amount: "Amount",
            status: "Status",
            date: "Date",
            event: "Event",
            type: "Type",
            title: "Title",
            priority: "Priority",
            report_id: "Report ID",
            department: "Department",
            no_data: "No data found"
          },
          contact: {
            title: "Contact Information",
            description: "Contact details for",
            primary_contact: "Primary Contact",
            address: "Address",
            primary_email: "Primary Email",
            primary_phone: "Primary Phone",
            mobile: "Mobile",
            website: "Website",
            notes: "Notes",
            close: "Close"
          },
          message: {
            title: "Send Direct Message",
            description: "Send a direct message to",
            subject: "Subject",
            message: "Message",
            subject_placeholder: "Message subject...",
            message_placeholder: "Type your message...",
            cancel: "Cancel",
            send: "Send Message"
          },
          annual_report: {
            title: "Annual Subsidy Report",
            description: "Comprehensive overview of subsidy requests and utilization",
            total_requested: "Total Requested",
            approved_amount: "Approved Amount", 
            utilization_rate: "Utilization Rate",
            pending_requests: "Pending Requests"
          }
        },
        chat: {
          no_messages_title: "No messages yet",
          no_messages_description: "Start a conversation with {name} by sending a message below",
          quick_templates: "Quick message templates",
          message_placeholder: "Type your message here...",
          send_hint: "Press Ctrl+Enter to send",
          sending_message: "Sending message...",
          message_sent: "Message sent successfully",
          send_failed: "Failed to send message",
          errors: {
            empty_message: "Please enter a message",
            file_too_large: "File is too large. Maximum size is 10MB"
          },
          templates: {
            meeting_request: "Meeting Request",
            subsidy_follow_up: "Subsidy Follow-up", 
            event_invitation: "Event Invitation",
            document_request: "Document Request"
          },
          attachments: "Attachments",
          drop_files: "Drop files to attach",
          status: {
            sent: "Sent",
            delivered: "Delivered",
            read: "Read",
            online: "Online",
            offline: "Offline"
          }
        }
      },
      annual_budget: {
        title: "Annual Budget Management",
        subtitle: "Manage budget requests and approvals across all organizational entities",
        messages: {
          refresh_success: "Budget data refreshed successfully",
          refreshing: "Refreshing budget data...",
          refresh_error: "Failed to refresh budget data"
        },
        buttons: {
          new_budget_request: "New Budget Request",
          refresh: "Refresh",
          add_year: "Add Year"
        },
        year_filter: {
          title: "Budget Year",
          subtitle_single: "{{count}} request for {{year}}",
          subtitle_plural: "{{count}} requests for {{year}}"
        },
        kpi_cards: {
          total_institution_budget: {
            title: "Total Institution Budget",
            subtitle: "Budget for {{year}}",
            subtitle_not_set: "Click to set budget for {{year}}",
            not_set: "Not Set",
            trend: "vs last year"
          },
          total_allocated: {
            title: "Total Allocated",
            subtitle: "Allocated to departments",
            trend: "vs last year"
          },
          total_spent: {
            title: "Total Spent",
            subtitle: "Current spending",
            trend: "vs last month"
          },
          budget_remaining: {
            title: "Budget Remaining",
            subtitle_available: "Available for allocation",
            subtitle_deficit: "Budget deficit",
            trend: "vs last year"
          },
          budget_utilization: {
            title: "Budget Utilization",
            subtitle: "{{count}} active departments",
            trend: "vs last year"
          }
        },
        charts: {
          budget_analytics: {
            title: "Budget Analytics Overview"
          },
          spending_over_time: {
            title: "Department Spending Over Time",
            subtitle: "Showing spending trends for {{year}}",
            time_ranges: {
              "12m": "Last 12 months",
              "6m": "Last 6 months",
              "3m": "Last 3 months"
            },
            chart_types: {
              area: "Area",
              bar: "Bar"
            }
          },
          budget_distribution: {
            title: "Institution Budget Distribution {{year}}",
            subtitle: "Total budget vs allocated to departments",
            label: {
              allocated: "Allocated",
              percentage_text: "Allocated",
              total_budget: "Total Budget"
            },
            legend: {
              allocated: "Allocated",
              remaining: "Remaining"
            }
          },
          department_spending: {
            title: "Department Spending"
          }
        },
        table: {
          title: "Budget Management Table",
          subtitle: "Manage budget requests, lock/unlock budgets, and track spending across all entities",
          title_departments: "Department Budgets",
          subtitle_departments: "Manage annual budgets for all institutional departments",
          headers: {
            entity_name: "Entity Name",
            department_name: "Department Name",
            entity_type: "Type",
            budget_total: "Total Budget",
            spent_amount: "Total Spent",
            usage_percentage: "Usage %",
            lock_status: "Lock Status",
            budget_status: "Budget Status",
            actions: "Actions",
            allocated_amount: "Allocated Amount"
          },
          lock_tooltips: {
            locked: "Click to unlock",
            unlocked: "Click to lock",
            disabled: "Budget record missing"
          },
          lock_actions: {
            lock: "Lock budget",
            unlock: "Unlock budget"
          },
          budget_status_labels: {
            completed: "Completed",
            missing: "Missing"
          },
          actions_menu: {
            manage: "Manage Budget",
            register: "Register Budget",
            lock: "Lock Budget",
            unlock: "Unlock Budget",
            approve: "Approve Budget",
            reject: "Reject Budget",
            request_revision: "Request Revision",
            delete: "Delete Budget"
          }
        },
        modals: {
          add: {
            title: "Add Annual Budget",
            description: "Create a new annual budget for the institution"
          },
          edit: {
            title: "Edit Annual Budget",
            description: "Update annual budget information"
          },
          steps: {
            basic_information: "Budget Overview",
            basic_information_desc: "Year, planned budget, and current status",
            financial_details: "Financial Details",
            financial_details_desc: "Expenses, balance, and financial tracking",
            additional_info: "Additional Information",
            additional_info_desc: "Notes, approvals, and comments"
          },
          fields: {
            year: "Budget Year",
            year_placeholder: "Enter budget year (e.g., 2024)",
            year_help: "The fiscal year this budget applies to",
            planned_budget: "Planned Budget",
            planned_budget_placeholder: "Enter planned budget amount",
            total_expenses: "Total Expenses",
            total_expenses_placeholder: "Enter total expenses to date",
            balance: "Current Balance",
            balance_placeholder: "Calculated automatically",
            balance_help: "Balance is calculated automatically as Planned Budget - Total Expenses",
            status: "Budget Status",
            status_placeholder: "Select budget status",
            status_help: "Current stage of the budget process",
            notes: "Notes",
            notes_placeholder: "Additional notes or comments about this budget...",
            no_notes: "No notes provided",
            approved_by: "Approved By",
            approved_by_placeholder: "Select approving user",
            available_budget_hint: "Available budget"
          },
          status_options: {
            planned: "Planned",
            approved: "Approved",
            in_progress: "In Progress",
            closed: "Closed"
          },
          validation: {
            year_required: "Budget year is required",
            year_invalid: "Please enter a valid year (e.g., 2024)",
            year_min: "Year must be 2000 or later",
            year_max: "Year cannot be more than 10 years in the future",
            planned_budget_required: "Planned budget is required",
            planned_budget_invalid: "Please enter a valid budget amount",
            planned_budget_min: "Planned budget must be greater than 0",
            exceeds_available_budget: "Budget exceeds available amount: {{available}}",
            total_expenses_invalid: "Please enter a valid expense amount",
            total_expenses_negative: "Total expenses cannot be negative",
            reserved_invalid: "Please enter a valid reserved amount",
            reserved_negative: "Reserved amount cannot be negative",
            status_required: "Budget status is required",
            fix_errors: "Please fix the errors before continuing"
          },
          buttons: {
            previous: "Previous",
            next: "Next",
            cancel: "Cancel",
            save: "Save Budget",
            update: "Update Budget",
            close: "Close",
            edit: "Edit"
          },
          summary: {
            title: "Budget Summary",
            planned: "Planned",
            expenses: "Expenses",
            balance: "Balance",
            spent: "Spent",
            reserved: "Reserved",
            available: "Available"
          },
          review: {
            title: "Review & Confirm"
          },
          system_info: {
            title: "System Information",
            created_at: "Created At",
            updated_at: "Updated At"
          },
          lock_tooltip: {
            locked: "Unlock first to be able to edit",
            unlocked: "Unlocked - Can be edited"
          },
          status: {
            positive: "Positive",
            deficit: "Deficit",
            deleted: "Deleted"
          },
          messages: {
            saving: "Saving...",
            updating: "Updating...",
            loading: "Loading...",
            saved: "Annual budget saved successfully!",
            updated: "Annual budget updated successfully!",
            save_failed: "Failed to save annual budget",
            update_failed: "Failed to update annual budget",
            lock_success: "Budget locked successfully",
            unlock_success: "Budget unlocked successfully",
            approve_success: "Budget approved successfully",
            reject_success: "Budget rejected successfully",
            revision_success: "Revision requested successfully",
            delete_success: "Budget deleted successfully",
            lock_error: "Failed to toggle budget lock",
            approve_error: "Failed to approve budget",
            reject_error: "Failed to reject budget",
            revision_error: "Failed to request revision",
            delete_error: "Failed to delete budget",
            institution_budget_not_found: "Institution budget not found for the selected year",
            budget_locked_edit: "Budget is locked. Unlock it first to edit.",
            cannot_add_year_beyond: "Cannot add years beyond {{maxYear}}",
            year_already_exists: "This year already exists",
            department_budget_save_failed: "Failed to save department budget. Please try again.",
            institution_budget_create_failed: "Failed to create institution budget. Please try again.",
            budget_id_required: "Budget ID is required for updates",
            no_budget_selected: "No budget selected for update",
            budget_update_failed: "Failed to update budget. Please try again.",
            year_added_success: "Year {{year}} added successfully! You can now select it and create budgets.",
            department_budget_updated: "Department budget updated successfully!",
            department_budget_created: "Budget for {{departmentName}} created successfully!",
            institution_budget_created: "Institution budget for {{year}} created successfully!",
            budget_updated: "Budget updated successfully!"
          },
          lock_institution: {
            title: "Confirm Institution Lock",
            description: "Some departments do not have budgets yet. Locking the institution budget will also lock all existing department budgets. Are you sure you want to continue?"
          },
          delete: {
            title: "Delete Budget",
            description: "This action will permanently delete the budget and all related data.",
            view_consequences: "View Consequences",
            understand_consequences: "I understand the consequences of deleting this budget",
            acknowledge_text: "I acknowledge that all budget data and history will be permanently lost.",
            type_confirmation: "Type \"DELETE BUDGET\" to confirm:",
            confirmation_placeholder: "DELETE BUDGET",
            confirmation_help: "Type exactly as shown above to enable the delete button",
            delete_budget: "Delete Budget",
            consequences: {
              financial_record: "Financial Record Loss",
              financial_record_desc: "All financial records, transactions, and budget history will be permanently removed.",
              historical_data: "Historical Data Loss",
              historical_data_desc: "Budget trends, comparisons, and historical analytics will be affected.",
              reporting_impact: "Reporting Impact",
              reporting_impact_desc: "Financial reports and annual statements will no longer include this budget data.",
              approval_chain: "Approval Chain Loss",
              approval_chain_desc: "All approval history, reviewers, and authorization records will be deleted."
            },
            permanent_warning: {
              title: "This is a permanent action",
              description: "Budget records cannot be recovered once deleted. All data will be permanently lost."
            },
            messages: {
              deleting: "Deleting...",
              deleted: "Budget deleted successfully",
              delete_failed: "Failed to delete budget"
            }
          }
        }
      },
      funding_rules: {
        create_modal: {
          title: "Create New Rule for \"{{groupName}}\"",
          steps: {
            basic_info: "Basic Information",
            condition: "Build Condition",
            review: "Review & Confirm"
          },
          progress_labels: {
            information: "Information",
            condition: "Condition",
            review: "Review"
          },
          step1: {
            rule_name_label: "Rule Name",
            rule_name_placeholder: "e.g., Maximum budget per request",
            description_label: "Description (Optional)",
            description_placeholder: "Brief description of this rule...",
            required: "*"
          },
          step2: {
            condition_type_label: "What type of condition?",
            value_types: {
              amount: "Value ($)",
              percentage: "Percentage (%)",
              requests: "Requests (#)"
            },
            operator_label: "Comparison Operator",
            operator_placeholder: "Select an operator...",
            operators: {
              greater_than: {
                label: "Greater than (>)",
                description: "Value must be greater than specified"
              },
              less_than: {
                label: "Less than (<)",
                description: "Value must be less than specified"
              },
              equal_to: {
                label: "Equal to (=)",
                description: "Value must be exactly equal"
              },
              between: {
                label: "Between (range)",
                description: "Value must be between two numbers"
              }
            },
            value_label: "Value",
            min_value_label: "Minimum value",
            max_value_label: "Maximum value",
            max_quantity_label: "Maximum quantity",
            period_label: "Time period",
            period_placeholder: "Select a period...",
            periods: {
              month: {
                label: "Per month",
                description: "Monthly limit"
              },
              quarter: {
                label: "Per quarter",
                description: "Quarterly limit (3 months)"
              },
              semester: {
                label: "Per semester",
                description: "Semester limit (6 months)"
              },
              year: {
                label: "Per year",
                description: "Annual limit"
              }
            },
            scope_label: "Scope",
            scope_placeholder: "Select a scope...",
            scopes: {
              per_user: {
                label: "Per user",
                description: "Individual limit per user"
              },
              total: {
                label: "In total",
                description: "Total limit for all users"
              }
            }
          },
          step3: {
            rule_name_label: "Rule Name",
            condition_label: "Condition",
            description_label: "Description",
            preview_label: "Rule preview:",
            preview_badges: {
              value: "value",
              percentage: "percentage",
              requests: "requests",
              condition: "Condition"
            }
          },
          buttons: {
            back: "Back",
            next: "Next",
            cancel: "Cancel",
            create: "Create Rule"
          },
          validation: {
            enter_name: "Please enter a rule name",
            enter_value: "Please enter a value for the condition",
            enter_second_value: "Please enter a second value for the 'between' condition",
            fill_required: "Please fill in all required fields"
          },
          toasts: {
            created: "Rule created successfully",
            create_failed: "Failed to create rule"
          },
          auto_description: {
            operators: {
              greater_than: "greater than",
              less_than: "less than",
              equal_to: "equal to",
              between: "between"
            },
            value_types: {
              amount: "value",
              percentage: "percentage",
              requests: "requests"
            },
            periods: {
              month: "per month",
              quarter: "per quarter",
              semester: "per semester",
              year: "per year"
            },
            per_user: "per user",
            in_total: "in total",
            maximum: "Maximum of",
            and: "and"
          }
        },
        edit_modal: {
          title: "Edit Rule \"{{ruleName}}\"",
          buttons: {
            update: "Update Rule"
          },
          toasts: {
            updated: "Rule updated successfully",
            update_failed: "Failed to update rule"
          }
        },
        delete_modal: {
          title: "Delete Rule",
          description: "This action cannot be undone",
          confirm_message: "Are you sure you want to delete this rule from \"{{groupName}}\"?",
          rule_preview: {
            title: "Rule to be deleted:",
            condition: "Condition"
          },
          warning: {
            title: "Permanent Deletion",
            message: "This rule will be permanently removed and cannot be recovered. All associated conditions and configurations will be lost."
          },
          understand_consequences: "I understand the consequences",
          acknowledge_text: "I acknowledge that this rule will be permanently deleted and this action is irreversible.",
          type_confirmation: "Type \"delete rule\" to confirm:",
          confirmation_placeholder: "delete rule",
          confirmation_help: "Type exactly \"delete rule\" (lowercase) to enable deletion.",
          buttons: {
            cancel: "Cancel",
            delete: "Delete Rule",
            deleting: "Deleting..."
          },
          toasts: {
            deleting: "Deleting rule...",
            deleted: "Rule deleted successfully",
            delete_failed: "Failed to delete rule"
          }
        }
      },
      subsidy: subsidyManagementTranslations.en,
      projectRegister: projectRegisterTranslations.en
    }
  },
  nl: {
    translation: {
      ...projectTranslations.nl,
      dashboard: {
        title: "Algemeen Dashboard",
        subtitle: "Overzicht van belangrijke systeemstatistieken",
        growth_chart_title: "Groei van Instellingen & Kerken",
        users_by_institution_chart_title: "Gebruikersdistributie per Instelling",
        financial_chart_title: "Departementbudget vs. Subsidieaanvragen",
        subsidy_status_chart_title: "Status Subsidieaanvragen",
        events_chart_title: "Evenementdeelname per Type",
        communications_chart_title: "Communicatie & Berichtenstroom",
        recent_activities: "Recente Activiteiten",
        quick_actions: "Snelle Acties"
      },
      privacy: {
        protected_content: "Beschermde Inhoud",
        contact_admin: "Neem contact op met de beheerder voor toegang"
      },
      activities: {
        modal: {
          title: "Activiteitdetails",
          edit_title: "Activiteit Bewerken",
          status: "Status",
          priority: "Prioriteit", 
          category: "Categorie",
          budget: "Budget",
          subsidy: "Subsidie",
          description: "Beschrijving",
          documents: "Documenten",
          system_info: "Systeeminformatie",
          created_at: "Aangemaakt op",
          updated_at: "Bijgewerkt op",
          created_by: "Aangemaakt door",
          updated_by: "Bijgewerkt door",
          activity_id: "Activiteit ID",
          total_budget: "Totaal Budget",
          rich_editor: "Rijke Editor",
          click_to_edit: "Klik om beschrijving te bewerken",
          drop_files: "Sleep bestanden hier of klik om te uploaden",
          supported_formats: "Ondersteunt PDF en afbeeldingen tot 10MB",
          no_documents: "Geen documenten bijgevoegd",
          use_button_above: "Gebruik de knop hierboven om documenten toe te voegen",
          save_changes: "Wijzigingen Opslaan",
          unsaved_changes: "Er zijn niet-opgeslagen wijzigingen",
          close: "Sluiten",
          tooltips: {
            status: "Huidige activiteitstatus",
            priority: "Urgentieniveau van activiteit", 
            category: "Type activiteit",
            subsidy: "Of deze activiteit gesubsidieerd is of niet",
            total_requested_amount: "Totaal aangevraagd bedrag voor deze activiteit"
          },
          status_labels: {
            planning: "Planning",
            in_progress: "In Uitvoering",
            completed: "Voltooid",
            pending_approval: "In Afwachting van Goedkeuring",
            cancelled: "Geannuleerd"
          },
          priority_labels: {
            urgent: "Urgent",
            high: "Hoog",
            medium: "Gemiddeld",
            low: "Laag"
          },
          tag_labels: {
            reform: "Hervorming",
            equipment: "Apparatuur",
            materials: "Materialen",
            training: "Training",
            travel: "Reizen",
            event: "Evenement",
            transport: "Transport",
            marketing: "Marketing",
            services: "Diensten",
            feeding: "Voeding",
            accommodation: "Accommodatie"
          },
          total_requested_amount: "Totaal Aangevraagd Bedrag",
          press_enter_to_save: "Druk op Enter of klik buiten om op te slaan",
          done: "Klaar",
          no_category: "Geen categorie",
          assignees: "Verantwoordelijken",
          assignees_count: "{{count}} verantwoordelijken",
          select_assignees: "Selecteer Verantwoordelijken",
          search_user: "Zoek gebruiker...",
          click_to_add_description: "Klik hier om een beschrijving toe te voegen...",
          metadata: "Metadata",
          history: "Geschiedenis",
          technical_details: "Technische details en activiteitsmetadata",
          change_history: "Wijzigingsgeschiedenis van activiteit",
          status_options: {
            todo: "Te Doen",
            in_progress: "In Uitvoering", 
            completed: "Voltooid",
            on_hold: "In Wacht"
          },
          priority_options: {
            urgent: "Urgent",
            high: "Hoog",
            medium: "Gemiddeld", 
            low: "Laag"
          },
          category_options: {
            reforma: "Hervorming",
            material: "Materiaal",
            training: "Training"
          },
          subsidy_info: {
            subsidized: "Deze activiteit wordt gesubsidieerd",
            not_subsidized: "Deze activiteit wordt niet gesubsidieerd",
            click_to_toggle: "Klik om subsidiestatus te wisselen"
          },
          delete: {
            title: "Activiteit Verwijderen",
            description: "Deze actie zal de activiteit en alle gerelateerde gegevens permanent verwijderen.",
            affected_data: "Beïnvloede Gegevens",
            view_consequences: "Gevolgen Bekijken",
            understand_consequences: "Ik begrijp de gevolgen van het verwijderen van deze activiteit",
            acknowledge_text: "Ik bevestig dat alle activiteitsgegevens en voortgang permanent verloren gaan.",
            type_confirmation: "Typ \"DELETE ACTIVITY\" om te bevestigen:",
            confirmation_placeholder: "DELETE ACTIVITY",
            confirmation_text: "delete activity",
            confirmation_help: "Typ exact zoals hierboven weergegeven om de verwijderknop in te schakelen",
            delete_activity: "Activiteit Verwijderen",
            deleting: "Verwijderen...",
            consequences: {
              data_loss: "Volledig Gegevensverlies",
              data_loss_desc: "Alle activiteitsinformatie, voortgangsregistratie en metadata worden permanent verwijderd.",
              budget_impact: "Budget Impact",
              budget_impact_desc: "Het toegewezen budget wordt teruggegeven aan de beschikbare fondsen van het project.",
              progress_loss: "Voortgangsregistratie Verlies",
              progress_loss_desc: "Alle voortgangsregistratie, mijlpalen en voltooiingsrecords gaan verloren.",
              documentation_loss: "Documentatie Verlies",
              documentation_loss_desc: "Alle bijgevoegde documenten, notities of gerelateerde bestanden worden permanent verwijderd."
            },
            permanent_warning: {
              title: "Dit is een permanente actie",
              description: "In tegenstelling tot instellingen of gebruikers kunnen activiteiten niet worden hersteld zodra ze zijn verwijderd. Alle gegevens gaan permanent verloren."
            }
          }
        },
        subsidized: "Gesubsidieerd",
        budget: "Budget",
        priority: "Prioriteit",
        status: "Status",
        subsidy: "Subsidie",
        toasts: {
          deleting: "Activiteit verwijderen...",
          deleted: "Activiteit succesvol verwijderd",
          delete_failed: "Kon activiteit niet verwijderen"
        },
        table: {
          activity: "Activiteit",
          category: "Categorie",
          subsidy_status: "Subsidie",
          budget: "Budget",
          status: "Status",
          priority: "Prioriteit",
          actions: "Acties",
          manage_activity: "Activiteit Beheren",
          remove: "Verwijderen",
          subsidized_tab: "Gesubsidieerd",
          non_subsidized_tab: "Niet Gesubsidieerd",
          no_subsidized_found: "Geen gesubsidieerde activiteiten gevonden",
          no_non_subsidized_found: "Geen niet-gesubsidieerde activiteiten gevonden",
          adjust_filters: "Pas de filters aan om meer activiteiten te zien.",
          create_first_subsidized: "Begin met het maken van de eerste gesubsidieerde activiteit voor het project.",
          create_first_non_subsidized: "Begin met het maken van de eerste niet-gesubsidieerde activiteit voor het project.",
          new_activity: "Nieuwe Activiteit",
          clear_filters: "Filters Wissen",
          filters_cleared: "Filters gewist"
        },
        logs: {
          no_history: "Geen wijzigingsgeschiedenis gevonden",
          fields: {
            status: "Status",
            priority: "Prioriteit",
            name: "Naam",
            description: "Beschrijving",
            budget_amount: "Budget",
            deadline: "Deadline",
            owner_id: "Verantwoordelijke",
            is_subsidized: "Gesubsidieerd",
            activity_tag: "Categorie (Verouderd)",
            tags: "Categorieën",
            custom_tags: "Aangepaste Tags"
          },
          values: {
            yes: "Ja",
            no: "Nee"
          },
          actions: {
            created: "{{user}} heeft de activiteit aangemaakt",
            deleted: "{{user}} heeft de activiteit verwijderd",
            status_changed: "{{user}} heeft de status gewijzigd van",
            priority_changed: "{{user}} heeft de prioriteit gewijzigd van",
            budget_updated: "{{user}} heeft het budget bijgewerkt van",
            subsidized_marked: "{{user}} heeft gemarkeerd als gesubsidieerd",
            subsidized_unmarked: "{{user}} heeft de subsidie verwijderd",
            field_updated: "{{user}} heeft {{field}} bijgewerkt",
            from: "van",
            to: "naar",
            generic_action: "{{user}} heeft een actie uitgevoerd: {{action}}"
          },
          time: {
            just_now: "Zojuist",
            minutes_ago: "{{count}}m geleden",
            hours_ago: "{{count}}u geleden",
            days_ago: "{{count}}d geleden"
          }
        },
        user_selector: {
          add_assignees: "Verantwoordelijken Toevoegen",
          select_assignees: "Selecteer Verantwoordelijken",
          search_user: "Zoek gebruiker...",
          selected: "Geselecteerd",
          search_label: "Zoek Gebruiker",
          available_users: "Beschikbare Gebruikers",
          no_user_found: "Geen gebruiker gevonden",
          no_user_available: "Geen gebruiker beschikbaar",
          selection_count: "{{selected}} van {{max}} gebruiker(s) geselecteerd",
          cancel: "Annuleren",
          confirm: "Bevestigen ({{count}})"
        },
        documents: {
          title: "Bijgevoegde Bestanden",
          uploading: "Uploaden...",
          upload_files: "Upload {{count}} bestand(en)",
          files_added: "{{count}} bestand(en) toegevoegd",
          files_rejected: "Sommige bestanden zijn afgewezen (alleen PDF en afbeeldingen tot 10MB)",
          drag_or_click: "Sleep bestanden hier of klik om te selecteren",
          supported_formats: "Ondersteunde formaten: JPG, PNG, PDF (max. 10MB)",
          pending_upload: "Bestanden in afwachting van upload:",
          pending_upload_count: "{{count}} bestanden in afwachting van upload",
          loading: "Documenten laden...",
          uploaded_documents: "Geüploade documenten ({{count}}):",
          uploaded_on: "Geüpload op",
          validated: "Gevalideerd",
          pending: "In Afwachting",
          download_document: "Document downloaden",
          validate_document: "Document valideren",
          delete_confirm: "Weet u zeker dat u dit document wilt verwijderen?",
          delete_document: "Document verwijderen",
          no_documents: "Nog geen documenten bijgevoegd",
          drag_to_add: "Sleep bestanden of klik op \"Upload\" om toe te voegen",
          no_files_attached: "Geen bestanden bijgevoegd",
          files_will_upload_on_save: "Bestanden worden automatisch geüpload bij opslaan",
          uploading_files: "Bestanden uploaden...",
          files_uploaded_successfully: "Bestanden succesvol geüpload"
        }
      },
      metrics: {
        total_users: "Totaal Gebruikers",
        total_institutions: "Totaal Instellingen",
        total_churches: "Totaal Kerken",
        pending_subsidies: "Wachtende Subsidies",
        active_regions: "Actieve Regio's",
        monthly_growth: "Maandelijkse Groei",
        budget_utilization: "Budgetbenutting",
        event_participation: "Evenementdeelname"
      },
      common: {
        ...projectTranslations.nl.common,
        language: "Taal",
        english: "Engels",
        dutch: "Nederlands",
        profile: "Profiel",
        loading: "Laden...",
        error: "Er is een fout opgetreden",
        success: "Succes",
        confirm: "Bevestigen",
        impact: "Impact van actie",
        consequences: "Gevolgen van deze actie",
        undone: "Deze actie kan niet ongedaan worden gemaakt",
        riskAware: "U bent zich bewust van de risico's",
        approve: "Goedkeuren",
        reject: "Afwijzen",
        cancel: "Annuleren",
        save: "Opslaan",
        edit: "Bewerken",
        delete: "Verwijderen",
        view: "Bekijken",
        filter: "Filter",
        search: "Zoeken",
        export: "Exporteren",
        refresh: "Vernieuwen",
        columns: "Kolommen",
        clear_filters: "Filters Wissen",
        close: "Sluiten",
        upload: "Uploaden",
        active: "Actief",
        inactive: "Inactief",
        status: "Status",
        structure_organization: "Structuur & Organisatie",
        members: "Leden",
        budget: "Budget",
        actions: "Acties",
        refreshing: "Vernieuwen...",
        data_refreshed: "Gegevens vernieuwd",
        error_refreshing: "Fout bij vernieuwen van gegevens",
        annual_budget: "Jaarbudget",
        data_loaded: "Gegevens succesvol geladen",
        coming_soon: "Binnenkort Beschikbaar",
        coming_soon_description: "Deze functie is in ontwikkeling en zal binnenkort beschikbaar zijn.",
        theme: "Thema",
        light_mode: "Licht",
        dark_mode: "Donker",
        theme_light_activated: "Lichte modus geactiveerd",
        theme_dark_activated: "Donkere modus geactiveerd",
        invite: "Uitnodigen",
        see_all_churches: "Bekijk Alle Kerken",
        all_members_associated_with: "Alle leden verbonden aan",
        all_departments_within: "Alle afdelingen binnen",
        view_contact: "Contact Bekijken",
        add: "Toevoegen",
        create: "Aanmaken",
        total: "Totaal",
        apply: "Toepassen",
        irreversible: "Deze actie kan niet ongedaan worden gemaakt",
        deletePermanently: "Definitief Verwijderen",
        registeredUsers: "Geregistreerde Gebruikers"
      },
      kanban: {
        dropItemHere: "Item hier neerzetten",
        noItemsYet: "Nog geen items",
        addFirstItem: "Eerste item toevoegen",
        addNewGroup: "Nieuwe Groep Toevoegen",
        createNewGroup: "Maak een nieuwe groep",
        createGroup: "Groep Maken",
        createGroupDescription: "Vul de onderstaande gegevens in om een nieuwe groep te maken",
        groupName: "Groepsnaam",
        groupNamePlaceholder: "bijv. In Behandeling, Voltooid",
        groupDescription: "Beschrijving",
        groupDescriptionPlaceholder: "Korte beschrijving van het doel van deze groep",
        groupColor: "Kleur",
        item: "item",
        items: "items"
      },
      actions: {
        ...projectTranslations.nl.actions,
        add_member: "Lid Toevoegen",
        create_event: "Evenement Maken",
        manage_subsidies: "Subsidies Beheren",
        view_reports: "Rapporten Bekijken",
        send_communication: "Communicatie Versturen",
        manage_departments: "Afdelingen Beheren",
        view_details: "Details Bekijken",
        create_institution: "Instelling Maken"
      },
      institutions: {
        title: "Instellingen",
        subtitle: "Beheer instellingen en hun relaties",
        overview: "Overzicht",
        all_institutions: "Alle Instellingen",
        page_header: {
          title: "Instellingoverzicht",
          subtitle: "Volledige beheerinterface voor institutionele structuur",
          new_institution: "Nieuwe Instelling"
        },
        entity_info: {
          header_title: "Instellingsinformatie",
          active: "Actief",
          inactive: "Inactief",
          established: "Opgericht"
        },
        actions: {
          view_contact_details: "Contactgegevens Bekijken",
          manage_churches: "Kerken Beheren",
          manage_departments: "Afdelingen Beheren",
          manage_annual_budgets: "Jaarbudgetten Beheren",
          edit_institution: "Instelling Bewerken",
          delete_institution: "Instelling Verwijderen"
        },
        analytics: {
          title: "Instellingsanalyses"
        },
        table_card: {
          title: "Instellingenlijst",
          description: "Volledige lijst van instellingen met beheeracties"
        },
        filters: {
          institution: "Instelling",
          denomination: "Denominatie",
          country: "Land",
          language: "Taal"
        },
        kpis: {
          total_institutions: "Totaal Instellingen",
          total_regions: "Totaal Regio's",
          total_churches: "Totaal Kerken",
          total_departments: "Totaal Afdelingen",
          total_users: "Totaal Gebruikers",
          total_budget: "Totaal Budget",
          annual_budget: "Jaarlijks Budget",
          pending_subsidies: "Wachtende Subsidies",
          budget_utilization: "Budgetbenutting"
        },
        charts: {
          churches_by_region: "Kerken per Regio",
          users_by_role: "Gebruikers per Rol",
          subsidy_over_time: "Subsidieaanvragen in de Tijd",
          revenue_vs_budget: "Inkomsten vs Jaarlijks Budget",
          monthly_subsidies: "Maandelijkse Subsidietrends"
        },
        table: {
          name: "Naam Instelling",
          country: "Land",
          denomination: "Denominatie",
          language: "Taal",
          churches: "Kerken",
          users: "Gebruikers",
          members: "Leden",
          regions: "Regio's",
          budget: "Budget",
          budget_status: "Budget Status",
          actions: "Acties",
          search_placeholder: "Zoek instellingen...",
          no_results: "Geen instellingen gevonden",
          showing_results: "{{from}} tot {{to}} van {{total}} instellingen weergegeven"
        },
        modal: {
          create_title: "Nieuwe Instelling Maken",
          edit_title: "Instelling Bewerken",
          basic_info: "Basisinformatie",
          contact_info: "Contactinformatie",
          review: "Beoordeling",
          name: "Naam Instelling",
          name_placeholder: "Voer naam instelling in",
          denomination: "Denominatie",
          denomination_placeholder: "Selecteer of voer denominatie in",
          language_preference: "Taalvoorkeur",
          country: "Land",
          country_placeholder: "Selecteer land",
          city: "Stad",
          city_placeholder: "Voer stad in",
          address: "Adres",
          address_placeholder: "Voer volledig adres in",
          email: "E-mail",
          email_placeholder: "Voer contact e-mail in",
          phone: "Telefoon",
          phone_placeholder: "Voer telefoonnummer in",
          website: "Website",
          website_placeholder: "Voer website URL in",
          next: "Volgende",
          back: "Terug",
          create: "Instelling Maken",
          update: "Instelling Bijwerken",
          cancel: "Annuleren"
        },
        modals: {
          edit: {
            title: "Instelling Bewerken",
            description: "Werk instellingsinformatie en instellingen bij"
          },
          delete: {
            deactivate_title: "Instelling Deactiveren",
            deactivate_description: "Dit zal de instelling deactiveren en de toegang tot alle bijbehorende gebruikers en gegevens beperken.",
            affected_components: "Getroffen Componenten",
            view_consequences: "Bekijk Gevolgen",
            understand_consequences: "Ik begrijp de gevolgen van het deactiveren van deze instelling",
            acknowledge_text: "Deze actie zal alle gebruikers, regio's, kerken en afdelingen die bij deze instelling horen beïnvloeden.",
            type_confirmation: "Typ 'DELETE INSTITUTION' om te bevestigen:",
            confirmation_placeholder: "DELETE INSTITUTION",
            confirmation_help: "Typ exact zoals hierboven getoond om de verwijderknop in te schakelen",
            deactivating: "Deactiveren...",
            deactivate_institution: "Instelling Deactiveren",
            consequences: {
              user_access: "Gebruikerstoegang Beperking",
              user_access_desc: "Alle gebruikers die bij deze instelling horen verliezen onmiddellijk toegang tot het systeem.",
              data_preservation: "Gegevensbehoud",
              data_preservation_desc: "Alle gegevens inclusief subsidies, rapporten en communicatie worden bewaard maar gemarkeerd als inactief.",
              organizational_structure: "Organisatiestructuur",
              organizational_structure_desc: "Alle regio's, kerken en afdelingen worden gedeactiveerd maar gegevens blijven intact.",
              financial_data: "Financiële Gegevens",
              financial_data_desc: "Alle budgettoewijzingen, subsidieaanvragen en financiële rapporten worden bewaard voor auditdoeleinden."
            },
            soft_delete: {
              title: "Dit is een zachte deactivatie",
              description: "De instelling wordt gemarkeerd als inactief maar alle gegevens worden bewaard. Deze actie kan worden teruggedraaid door een systeembeheerder."
            }
          }
        },
        fields: {
          name: "Naam Instelling",
          denomination: "Denominatie",
          language_preference: "Taalvoorkeur"
        },
        placeholders: {
          name: "Voer naam instelling in",
          denomination: "Voer denominatie in",
          language_preference: "Selecteer voorkeurstaal"
        },
        validation: {
          name_required: "Naam instelling is verplicht",
          name_min_length: "Naam instelling moet minimaal 2 karakters zijn",
          denomination_required: "Denominatie is verplicht",
          language_required: "Taalvoorkeur is verplicht"
        },
        stats: {
          regions: "Regio's",
          churches: "Kerken",
          departments: "Afdelingen",
          users: "Gebruikers"
        },
        saving: "Opslaan...",
        toasts: {
          loaded: "Instellingsgegevens succesvol geladen",
          error_loading: "Fout bij laden van instellingsgegevens",
          institution_details_loaded: "Instellingsdetails geladen",
          institution_switched: "Instellingsfilter gewijzigd",
          create_success: "Instelling succesvol aangemaakt",
          create_error: "Fout bij aanmaken instelling",
          update_success: "Instelling succesvol bijgewerkt",
          update_error: "Fout bij bijwerken instelling",
          delete_success: "Instelling succesvol verwijderd",
          delete_error: "Fout bij verwijderen instelling",
          language_switched: "Taal succesvol gewijzigd",
          updating: "Instelling bijwerken...",
          updated: "Instelling succesvol bijgewerkt",
          update_failed: "Kon instelling niet bijwerken",
          deactivating: "Instelling deactiveren...",
          deactivated: "Instelling succesvol gedeactiveerd",
          deactivate_failed: "Kon instelling niet deactiveren",
          image_uploading: "Afbeelding uploaden...",
          image_uploaded: "Afbeelding succesvol geüpload",
          image_upload_failed: "Kon afbeelding niet uploaden",
          image_removing: "Afbeelding verwijderen...",
          image_removed: "Afbeelding succesvol verwijderd",
          image_remove_failed: "Kon afbeelding niet verwijderen",
          created: "Instelling succesvol aangemaakt",
          refreshing_data: "Gegevens vernieuwen...",
          data_refreshed: "Gegevens succesvol vernieuwd",
          error_refreshing_data: "Fout bij vernieuwen van gegevens",
          no_institution_selected: "Geen instelling geselecteerd"
        }
      },
      regions: {
        title: "Regio's",
        subtitle: "Beheer regionale divisies en gebieden",
        modals: {
          create: {
            title: "Nieuwe Regio Toevoegen",
            description: "Maak een nieuwe regionale divisie voor uw instelling"
          },
          edit: {
            title: "Regio Bewerken",
            description: "Werk regio informatie en instellingen bij"
          },
          delete: {
            deactivate_title: "Regio Deactiveren",
            deactivate_description: "Dit zal de regio deactiveren en ontoegankelijk maken voor gebruikers. De regio gegevens worden bewaard.",
            view_consequences: "Bekijk Gevolgen",
            understand_consequences: "Ik begrijp de gevolgen",
            acknowledge_text: "Ik erken dat deze actie kerken en gerelateerde gegevens zal beïnvloeden.",
            type_confirmation: "Typ 'delete region' om te bevestigen",
            confirmation_placeholder: "delete region",
            confirmation_help: "Deze actie kan niet ongedaan worden gemaakt. Typ de exacte tekst om te bevestigen.",
            deactivating: "Deactiveren...",
            deactivate_region: "Regio Deactiveren",
            affected_components: "Getroffen Componenten",
            consequences: {
              church_access: "Verlies van Kerk Toegang",
              church_access_desc: "Kerken in deze regio verliezen toegang tot regionale bronnen en coördinatie.",
              data_preservation: "Gegevens Bewaring",
              data_preservation_desc: "Alle regio gegevens, budgetten en kerk informatie worden bewaard maar verborgen.",
              member_impact: "Leden Impact",
              member_impact_desc: "Regionale leden worden hertoegewezen aan andere regio's of gemarkeerd als niet-toegewezen.",
              event_impact: "Evenement Impact",
              event_impact_desc: "Regionale evenementen worden geannuleerd en nieuwe evenementen kunnen niet worden aangemaakt."
            },
            soft_delete: {
              title: "Zachte Verwijdering",
              description: "De regio wordt gedeactiveerd maar niet permanent verwijderd. Alle gegevens worden bewaard en kunnen indien nodig worden hersteld."
            }
          }
        },
        sections: {
          basic_info: "Basisinformatie",
          contact_info: "Contactinformatie"
        },
        fields: {
          name: "Naam Regio",
          parent_region: "Bovenliggende Regio",
          contact_name: "Contactnaam",
          contact_email: "Contact E-mail",
          contact_phone: "Contact Telefoon",
          contact_mobile: "Contact Mobiel",
          contact_country: "Land",
          contact_city: "Stad",
          contact_address: "Adres",
          contact_postal_code: "Postcode",
          contact_website: "Website"
        },
        placeholders: {
          name: "Voer naam regio in",
          parent_region: "Selecteer bovenliggende regio",
          no_parent: "Geen bovenliggende regio (topniveau)",
          country: "Selecteer land",
          contact_name: "Voer contactnaam in",
          contact_email: "Voer contact e-mail in",
          contact_phone: "Voer telefoonnummer in",
          contact_mobile: "Voer mobiel nummer in",
          contact_country: "Voer land in",
          contact_city: "Voer stad in",
          contact_address: "Voer adres in",
          contact_postal_code: "Voer postcode in",
          contact_website: "https://voorbeeld.com"
        },
        labels: {
          region: "Regio",
          contact: "Contact"
        },
        steps: {
          step: "Stap",
          of: "van"
        },
        buttons: {
          next: "Volgende",
          previous: "Vorige"
        },
        validation: {
          name_required: "Naam regio is verplicht",
          name_min_length: "Naam regio moet minimaal 2 karakters zijn",
          email_invalid: "Voer een geldig e-mailadres in",
          please_fix_errors: "Los de fouten op voordat u doorgaat"
        },
        creating: "Aanmaken...",
        updating: "Bijwerken...",
        stats: {
          churches: "Kerken",
          members: "Leden",
          budget: "Budget",
          utilization: "Benutting"
        },
        toasts: {
          creating: "Regio aanmaken...",
          created: "Regio succesvol aangemaakt",
          create_failed: "Kon regio niet aanmaken",
          updating: "Regio bijwerken...",
          updated: "Regio succesvol bijgewerkt",
          update_failed: "Kon regio niet bijwerken",
          deactivating: "Regio deactiveren...",
          deactivated: "Regio succesvol gedeactiveerd",
          deactivate_failed: "Kon regio niet deactiveren"
        }
      },
      churches: {
        title: "Kerken",
        subtitle: "Beheer kerken en hun organisatie",
        church: "Kerk",
        active_churches: "Actieve kerken",
        modals: {
          create: {
            title: "Nieuwe Kerk Toevoegen",
            description: "Maak een nieuwe kerk voor uw instelling"
          },
          edit: {
            title: "Kerk Bewerken",
            description: "Werk kerk informatie en instellingen bij"
          },
          delete: {
            deactivate_title: "Kerk Deactiveren",
            deactivate_description: "Dit zal de kerk deactiveren en ontoegankelijk maken voor gebruikers. De kerk gegevens worden bewaard.",
            view_consequences: "Bekijk Gevolgen",
            understand_consequences: "Ik begrijp de gevolgen",
            acknowledge_text: "Ik erken dat deze actie kerkleden en gerelateerde gegevens zal beïnvloeden.",
            type_confirmation: "Typ 'delete church' om te bevestigen",
            confirmation_placeholder: "delete church",
            confirmation_help: "Deze actie kan niet ongedaan worden gemaakt. Typ de exacte tekst om te bevestigen.",
            deactivating: "Deactiveren...",
            deactivate_church: "Kerk Deactiveren",
            affected_components: "Getroffen Componenten",
            consequences: {
              member_access: "Verlies van Leden Toegang",
              member_access_desc: "Kerk leden verliezen toegang tot kerk bronnen en activiteiten.",
              data_preservation: "Gegevens Bewaring",
              data_preservation_desc: "Alle kerk gegevens, budgetten en projectinformatie worden bewaard maar verborgen.",
              department_impact: "Afdeling Impact",
              department_impact_desc: "Kerk afdelingen worden gedeactiveerd en niet beschikbaar voor nieuwe activiteiten.",
              event_impact: "Evenement Impact",
              event_impact_desc: "Geplande evenementen worden geannuleerd en nieuwe evenementen kunnen niet worden aangemaakt."
            },
            soft_delete: {
              title: "Zachte Verwijdering",
              description: "De kerk wordt gedeactiveerd maar niet permanent verwijderd. Alle gegevens worden bewaard en kunnen indien nodig worden hersteld."
            }
          }
        },
        sections: {
          basic_info: "Basisinformatie",
          contact_info: "Contactinformatie"
        },
        fields: {
          name: "Naam Kerk",
          region: "Regio",
          contact_name: "Contactnaam",
          contact_email: "Contact E-mail",
          contact_phone: "Contact Telefoon",
          contact_mobile: "Contact Mobiel",
          contact_country: "Land",
          contact_city: "Stad",
          contact_address: "Adres",
          contact_postal_code: "Postcode",
          contact_website: "Website"
        },
        placeholders: {
          name: "Voer naam kerk in",
          region: "Selecteer regio",
          contact_name: "Voer contactnaam in",
          contact_email: "Voer contact e-mail in",
          contact_phone: "Voer telefoonnummer in",
          contact_mobile: "Voer mobiel nummer in",
          contact_country: "Voer land in",
          contact_city: "Voer stad in",
          contact_address: "Voer adres in",
          contact_postal_code: "Voer postcode in",
          contact_website: "https://voorbeeld.com"
        },
        labels: {
          church: "Kerk",
          contact: "Contact"
        },
        steps: {
          step: "Stap",
          of: "van"
        },
        buttons: {
          next: "Volgende",
          previous: "Vorige"
        },
        validation: {
          name_required: "Naam kerk is verplicht",
          name_min_length: "Naam kerk moet minimaal 2 karakters zijn",
          region_required: "Regio is verplicht",
          email_invalid: "Voer een geldig e-mailadres in",
          please_fix_errors: "Los de fouten op voordat u doorgaat"
        },
        creating: "Aanmaken...",
        updating: "Bijwerken...",
        stats: {
          members: "Leden",
          departments: "Afdelingen",
          budget: "Budget",
          events: "Evenementen"
        },
        toasts: {
          creating: "Kerk aanmaken...",
          created: "Kerk succesvol aangemaakt",
          create_failed: "Kon kerk niet aanmaken",
          updating: "Kerk bijwerken...",
          updated: "Kerk succesvol bijgewerkt",
          update_failed: "Kon kerk niet bijwerken",
          deactivating: "Kerk deactiveren...",
          deactivated: "Kerk succesvol gedeactiveerd",
          deactivate_failed: "Kon kerk niet deactiveren"
        }
      },
      departments: {
        title: "Afdelingen",
        subtitle: "Beheer afdelingen en hun organisatie",
        modals: {
          create: {
            title: "Nieuwe Afdeling Toevoegen",
            description: "Maak een nieuwe afdeling voor uw instelling"
          },
          edit: {
            title: "Afdeling Bewerken",
            description: "Werk afdelingsinformatie en instellingen bij"
          },
          delete: {
            deactivate_title: "Afdeling Deactiveren",
            deactivate_description: "Dit zal de afdeling deactiveren en ontoegankelijk maken voor gebruikers. De afdelingsgegevens worden bewaard.",
            view_consequences: "Bekijk Gevolgen",
            understand_consequences: "Ik begrijp de gevolgen",
            acknowledge_text: "Ik erken dat deze actie afdelingsleden en gerelateerde gegevens zal beïnvloeden.",
            type_confirmation: "Typ 'delete department' om te bevestigen",
            confirmation_placeholder: "delete department",
            confirmation_text: "delete department",
            confirmation_help: "Deze actie zal de afdeling tijdelijk deactiveren. Het kan later indien nodig opnieuw worden geactiveerd.",
            deactivating: "Deactiveren...",
            deactivate_department: "Afdeling Deactiveren",
            affected_components: "Getroffen Componenten",
            consequences: {
              member_access: "Verlies van Leden Toegang",
              member_access_desc: "Afdeling leden verliezen toegang tot afdelingsbronnen en activiteiten.",
              data_preservation: "Gegevens Bewaring",
              data_preservation_desc: "Alle afdelingsgegevens, budgetten en projectinformatie worden bewaard maar verborgen.",
              budget_impact: "Budget Impact",
              budget_impact_desc: "Afdeling budget toewijzingen worden bevroren en niet beschikbaar voor nieuwe projecten.",
              project_impact: "Project Impact",
              project_impact_desc: "Actieve projecten worden opgeschort en nieuwe projecten kunnen niet worden aangemaakt."
            },
            soft_delete: {
              title: "Zachte Verwijdering",
              description: "De afdeling wordt gedeactiveerd maar niet permanent verwijderd. Alle gegevens worden bewaard en kunnen indien nodig worden hersteld."
            }
          }
        },
        sections: {
          basic_info: "Basisinformatie",
          contact_info: "Contactinformatie"
        },
        fields: {
          name: "Naam Afdeling",
          church: "Kerk",
          description: "Beschrijving",
          annual_budget: "Jaarlijks Budget",
          contact_name: "Contactnaam",
          contact_email: "Contact E-mail",
          contact_phone: "Contact Telefoon",
          contact_mobile: "Contact Mobiel",
          contact_country: "Land",
          contact_city: "Stad",
          contact_address: "Adres",
          contact_postal_code: "Postcode",
          contact_website: "Website"
        },
        placeholders: {
          name: "Voer naam afdeling in",
          church: "Selecteer kerk",
          description: "Voer beschrijving afdeling in",
          annual_budget: "Voer jaarlijks budget bedrag in",
          contact_name: "Voer contactnaam in",
          contact_email: "Voer contact e-mail in",
          contact_phone: "Voer telefoonnummer in",
          contact_mobile: "Voer mobiel nummer in",
          contact_country: "Voer land in",
          contact_city: "Voer stad in",
          contact_address: "Voer adres in",
          contact_postal_code: "Voer postcode in",
          contact_website: "https://voorbeeld.com"
        },
        labels: {
          department: "Afdeling",
          contact: "Contact"
        },
        steps: {
          step: "Stap",
          of: "van"
        },
        buttons: {
          next: "Volgende",
          previous: "Vorige"
        },
        validation: {
          name_required: "Naam afdeling is verplicht",
          name_min_length: "Naam afdeling moet minimaal 2 karakters zijn",
          church_required: "Kerk is verplicht",
          description_required: "Beschrijving is verplicht",
          description_min_length: "Beschrijving moet minimaal 10 karakters zijn",
          budget_required: "Jaarlijks budget is verplicht en moet groter zijn dan 0",
          email_invalid: "Voer een geldig e-mailadres in",
          please_fix_errors: "Los de fouten op voordat u doorgaat"
        },
        creating: "Aanmaken...",
        updating: "Bijwerken...",
        stats: {
          church: "Kerk",
          members: "Leden",
          budget: "Budget",
          projects: "Projecten"
        },
        actions: {
          view_details: "Details Bekijken",
          edit_department: "Afdeling Bewerken",
          manage_budget: "Budget Beheren",
          delete_department: "Afdeling Verwijderen"
        },
        kpi: {
          budget_total: {
            title: "Budget Totaal",
            subtitle: "Totaal geplande budget"
          },
          spent_amount: {
            title: "Uitgegeven Bedrag",
            subtitle: "Totale uitgaven"
          },
          members: {
            title: "Leden",
            subtitle: "Afdeling leden"
          }
        },
        detail: {
          info_card: {
            header_title: "Afdeling Info",
            no_description: "Geen beschrijving beschikbaar",
            institutional: "Institutioneel",
            active: "Actief",
            inactive: "Inactief"
          }
        },
        toasts: {
          creating: "Afdeling aanmaken...",
          created: "Afdeling succesvol aangemaakt",
          create_failed: "Kon afdeling niet aanmaken",
          updating: "Afdeling bijwerken...",
          updated: "Afdeling succesvol bijgewerkt",
          update_failed: "Kon afdeling niet bijwerken",
          deactivating: "Afdeling deactiveren...",
          deactivated: "Afdeling succesvol gedeactiveerd",
          deactivate_failed: "Kon afdeling niet deactiveren"
        },
        analytics: "Analytics",
        utilization: "Benutting",
        budget_remaining: "Resterend Budget",
        requests: "Aanvragen",
        table_title: "Afdelingen",
        table_description: "Volledige lijst van afdelingen met beheeracties",
        create_department: "Afdeling Maken",
        edit_department: "Afdeling Bewerken",
        delete_department: "Afdeling Verwijderen"
      },
      access: {
        title: "Toegangsbeheer",
        subtitle: "Beheer gebruikers, rollen en machtigingen",
        overview: "Toegangsoverzicht",
        kpis: {
          total_users: "Totaal Gebruikers",
          total_roles: "Totaal Rollen",
          total_permissions: "Totaal Machtigingen",
          active_users: "Actieve Gebruikers",
          admin_users: "Admin Gebruikers",
          user_growth_rate: "Gebruikersgroei"
        },
        charts: {
          role_distribution: "Rolverdeling",
          permissions_by_group: "Machtigingen per Groep",
          user_activity: "Gebruikersactiviteit in de Tijd"
        },
        tabs: {
          users: "Gebruikers",
          roles: "Rollen",
          permissions: "Machtigingen"
        },
        users: {
          title: "Gebruikersbeheer",
          subtitle: "Beheer systeemgebruikers en hun toegang",
          table: {
            name: "Naam",
            email: "E-mail",
            institution: "Instelling",
            church: "Kerk",
            roles: "Rollen",
            created_at: "Aangemaakt",
            actions: "Acties",
            search_placeholder: "Zoek gebruikers...",
            no_results: "Geen gebruikers gevonden"
          },
          actions: {
            create_user: "Gebruiker Aanmaken",
            view_details: "Details Bekijken",
            edit_user: "Gebruiker Bewerken",
            assign_role: "Rol Toewijzen",
            remove_role: "Rol Verwijderen",
            delete_user: "Gebruiker Verwijderen"
          }
        },
        roles: {
          title: "Rollenbeheer",
          subtitle: "Beheer rollen en hun machtigingen",
          table: {
            name: "Rolnaam",
            key_code: "Sleutelcode",
            description: "Beschrijving",
            permissions_count: "Machtigingen",
            users_count: "Gebruikers",
            actions: "Acties",
            type: "Type"
          },
          actions: {
            create_role: "Rol Aanmaken",
            edit_role: "Rol Bewerken",
            edit_permissions: "Machtigingen Bewerken",
            duplicate_role: "Rol Dupliceren",
            delete_role: "Rol Verwijderen"
          },
          permissions: {
            title: "Rolmachtigingen Configuratie",
            subtitle: "Configureer gedetailleerde machtigingen voor deze rol",
            role_info: "Rolinformatie",
            permissions_matrix: "Machtigingenmatrix",
            select_all: "Alle Machtigingen Selecteren",
            select_none: "Alle Machtigingen Wissen",
            select_group: "Alles in Groep Selecteren",
            clear_group: "Groep Wissen",
            selected_count: "{{count}} machtigingen geselecteerd",
            total_permissions: "{{total}} totale machtigingen",
            unsaved_changes: "U heeft niet-opgeslagen wijzigingen",
            groups: {
              USER: "Gebruikersbeheer",
              ROLE: "Rollenbeheer",
              PERMISSION: "Machtigingenbeheer",
              INSTITUTION: "Instellingsbeheer",
              REGION: "Regiobeheer",
              CHURCH: "Kerkbeheer"
            },
            group_descriptions: {
              USER: "Beheer gebruikersaanmaak, bewerking en toegangsbeheer",
              ROLE: "Beheer systeemrollen en roltoewijzingen",
              PERMISSION: "Configureer systeembrede machtiginginstellingen",
              INSTITUTION: "Beheer instellingen en organisatiestructuur",
              REGION: "Beheer regionale afdelingen en gebieden",
              CHURCH: "Toezicht op kerkactiviteiten en -beheer"
            }
          }
        },
        permissions: {
          title: "Systeemmachtigingen",
          subtitle: "Bekijk alle beschikbare systeemmachtigingen",
          table: {
            name: "Machtigingsnaam",
            key_code: "Sleutelcode",
            description: "Beschrijving",
            group: "Groep"
          }
        },
        modals: {
          create_user: {
            title: "Nieuwe Gebruiker Aanmaken",
            name: "Volledige Naam",
            email: "E-mailadres",
            institution: "Instelling",
            church: "Kerk",
            language: "Taalvoorkeur",
            roles: "Rollen Toewijzen",
            create: "Gebruiker Aanmaken",
            cancel: "Annuleren"
          },
          create_role: {
            title: "Nieuwe Rol Aanmaken",
            description: "Maak een nieuwe rol met specifieke machtigingen voor systeemtoegang",
            name: "Rolnaam",
            name_placeholder: "Voer rolnaam in (bijv. Manager, Editor)",
            key_code: "Sleutelcode",
            key_code_placeholder: "Voer unieke sleutel in (bijv. MANAGER)",
            description_label: "Beschrijving",
            description_placeholder: "Beschrijf wat deze rol kan doen...",
            permissions_note: "U kunt machtigingen toewijzen na het aanmaken van de rol",
            create: "Rol Aanmaken"
          },
          edit_role: {
            title: "Rol Bewerken",
            description: "Wijzig roldetails en beheer machtigingen",
            name: "Rolnaam",
            key_code: "Sleutelcode",
            description_label: "Beschrijving",
            permissions: "Machtigingen",
            admin_key_locked: "Admin sleutelcode kan niet worden gewijzigd om veiligheidsredenen",
            edit_permissions: "Machtigingen Bewerken",
            save: "Wijzigingen Opslaan",
            cancel: "Annuleren"
          },
          delete_role: {
            title: "Rol Verwijderen",
            description: "Deze actie kan niet ongedaan worden gemaakt. De rol wordt permanent verwijderd.",
            reassign_description: "Deze rol is toegewezen aan gebruikers. U moet ze eerst opnieuw toewijzen.",
            reassign_to: "Gebruikers opnieuw toewijzen aan",
            select_role: "Selecteer een vervangende rol",
            reassign_warning: "Belangrijk: Gebruikersmachtigingen zullen veranderen",
            reassign_note: "Gebruikers erven onmiddellijk de machtigingen van de nieuwe rol",
            confirm_warning: "Weet u het absoluut zeker?",
            confirm_note: "Deze rol en al zijn associaties worden permanent verwijderd",
            skip_reassign: "Verwijderen Zonder Hertoewijzing",
            reassign_and_delete: "Hertoewijzen & Rol Verwijderen",
            delete: "Rol Verwijderen"
          }
        },
        toasts: {
          user_created: "Gebruiker succesvol aangemaakt",
          user_updated: "Gebruiker succesvol bijgewerkt",
          user_deleted: "Gebruiker succesvol verwijderd",
          role_created: "Rol succesvol aangemaakt",
          role_updated: "Rol succesvol bijgewerkt",
          role_deleted: "Rol succesvol verwijderd",
          role_assigned: "Rol succesvol toegewezen",
          role_removed: "Rol succesvol verwijderd",
          permissions_updated: "Machtigingen succesvol bijgewerkt",
          access_denied: "Toegang geweigerd - onvoldoende machtigingen",
          creating_role: "Rol aanmaken...",
          updating_role: "Rol bijwerken...",
          deleting_role: "Rol verwijderen...",
          role_create_failed: "Kon rol niet aanmaken",
          role_update_failed: "Kon rol niet bijwerken",
          role_delete_failed: "Kon rol niet verwijderen"
        }
      },
      users: {
        title: "Gebruikersbeheer",
        subtitle: "Beheer systeemgebruikers, rollen en machtigingen",
        overview: "Gebruikersoverzicht",
        registered_users: "Geregistreerde gebruikers",
        loading: "Gebruikersgegevens laden...",
        loaded: "Gebruikersgegevens succesvol geladen!",
        load_error: "Kon gebruikersgegevens niet laden",
        refreshing: "Gegevens vernieuwen...",
        refreshed: "Gegevens succesvol vernieuwd!",
        refresh_error: "Kon gegevens niet vernieuwen",
        kpis: {
          total_users: "Totaal Gebruikers",
          active_users: "Actieve Gebruikers",
          inactive_users: "Inactieve Gebruikers",
          new_users_month: "Nieuw Deze Maand",
          deleted_users: "Verwijderde Gebruikers",
          total_users_description: "Alle geregistreerde gebruikers",
          of_total: "van totaal",
          new_users_month_description: "Recent toegetreden",
          deleted_users_description: "Soft verwijderde gebruikers"
        },
        charts: {
          users_by_role: "Gebruikers per Rol",
          users_by_role_description: "Rolverdeling over gebruikers",
          users_by_institution: "Gebruikers per Instelling",
          users_by_institution_description: "Gebruikersaantal per instelling",
          user_growth: "Gebruikersgroei",
          user_growth_description: "Maandelijkse gebruikersregistratie trend",
          users_by_region: "Gebruikers per Regio",
          users_by_region_description: "Regionale gebruikersverdeling",
          users_by_department: "Gebruikers per Afdeling",
          users_by_department_description: "Afdelingsgebruikerstoewijzing"
        },
        table: {
          title: "Alle Gebruikers",
          description: "Beheer en bekijk alle systeemgebruikers",
          total_found: "gebruikers gevonden",
          avatar: "Avatar",
          name: "Naam",
          email: "E-mail",
          language: "Taal",
          institution: "Instelling",
          church: "Kerk",
          department: "Afdeling",
          department_type: "Afdelingstype",
          roles: "Rollen",
          status: "Status",
          actions: "Acties",
          search_placeholder: "Zoek gebruikers...",
          no_results: "Geen gebruikers gevonden",
          no_users: "Geen gebruikers gevonden",
          active: "Actief",
          inactive: "Inactief",
          gender: "Geslacht",
          no_role: "Geen Rol",
        },
        filters: {
          institution: "Instelling",
          church: "Kerk",
          department_type: "Afdelingstype",
          status: "Status",
          church_departmental: "Kerk Afdelings",
          institutional_departmental: "Institutionele Afdelings",
          no_departmental: "Geen Afdelings"
        },
        details: {
          language: "Taal",
          user_id: "Gebruikers-ID",
          institution: "Instelling",
          church: "Kerk",
          created: "Aangemaakt",
          updated: "Bijgewerkt"
        },
        gender: {
          MALE: "Man",
          FEMALE: "Vrouw",
        },
        actions: {
          create_user: "Gebruiker Aanmaken",
          edit_user: "Gebruiker Bewerken",
          delete_user: "Gebruiker Verwijderen",
          view_details: "Details Bekijken",
          view_contact: "Contact Bekijken",
          assign_roles: "Rollen Toewijzen",
          activate_user: "Gebruiker Activeren",
          deactivate_user: "Gebruiker Deactiveren"
        },
        modals: {
          create_user: {
            title: "Nieuwe Gebruiker Aanmaken",
            description: "Voeg een nieuwe gebruiker toe aan het systeem",
            name: "Volledige Naam",
            name_placeholder: "Voer de volledige naam in",
            email: "E-mailadres",
            email_placeholder: "Voer e-mailadres in",
            language: "Taalvoorkeur",
            institution: "Instelling",
            church: "Kerk",
            region: "Regio",
            department: "Afdeling (Optioneel)",
            roles: "Rollen Toewijzen",
            status: "Gebruikersstatus",
            create: "Gebruiker Aanmaken",
            cancel: "Annuleren"
          },
          edit_user: {
            title: "Gebruiker Bewerken",
            description: "Gebruikersinformatie en machtigingen bijwerken",
            // Form fields
            fields: {
              name: "Naam",
              email: "E-mail",
              language_preference: "Taalvoorkeur",
              gender: "Geslacht",
              male: "Man",
              female: "Vrouw",
              status: "Status",
              active: "Actief",
              inactive: "Inactief",
              institution: "Instelling",
              church: "Kerk",
              department: "Afdeling",
              roles: "Rollen"
            },
            // Step descriptions
            steps: {
              personal_info: "Persoonlijke Informatie",
              personal_info_description: "Voer basisgebruikersgegevens in",
              organizational_info: "Organisatie Informatie",
              organizational_info_description: "Selecteer instelling, kerk en afdeling (optioneel)",
              assign_roles: "Rollen Toewijzen",
              assign_roles_description: "Selecteer een of meer rollen voor deze gebruiker"
            },
            // Status messages
            status: {
              active_description: "Gebruiker heeft toegang tot het systeem",
              inactive_description: "Gebruiker verliest toegang tot het systeem",
              part_of_department: "Deel van een Afdeling?",
              part_of_department_description: "Is deze gebruiker deel van een afdeling?",
              no_church_departments: "Geen kerkafdelingen beschikbaar",
              no_institutional_departments: "Geen institutionele afdelingen beschikbaar",
              no_roles_assigned: "Geen rollen toegewezen"
            },
            // Department tabs
            departments: {
              church_departments: "Kerkafdelingen",
              institutional_departments: "Institutionele Afdelingen"
            },
            // Role categories
            categories: {
              all: "Alle",
              administration: "Administratie",
              church: "Kerk",
              institutional: "Institutioneel",
              leadership: "Leiderschap",
              member: "Lid"
            },
            // Buttons
            buttons: {
              back: "Terug",
              cancel: "Annuleren",
              continue: "Doorgaan",
              update_user: "Gebruiker Bijwerken",
              updating: "Bijwerken..."
            },
            // Progress
            progress: {
              step: "Stap",
              of: "van",
              percent: "%"
            },
            // Error messages
            errors: {
              name_required: "Naam is verplicht",
              email_required: "E-mail is verplicht",
              language_required: "Taal is verplicht",
              institution_required: "Instelling is verplicht",
              department_required: "Selecteer een afdeling",
              roles_required: "Wijs ten minste één rol toe",
              fill_all_fields: "Vul alle verplichte velden in"
            },
            // Success messages
            toasts: {
              updating_user: "Gebruiker bijwerken...",
              user_updated: "Gebruiker succesvol bijgewerkt",
              user_update_failed: "Kon gebruiker niet bijwerken"
            },
            // Placeholders
            placeholders: {
              select_language: "Selecteer taal",
              select_institution: "Selecteer instelling",
              select_church: "Selecteer kerk",
              search_departments: "Zoek afdelingen...",
              search_roles: "Zoek rollen..."
            },
            // Filter labels
            filters: {
              filter_by_category: "Filter op Categorie"
            },
            save: "Wijzigingen Opslaan"
          },
          delete_user: {
            title: "Gebruiker Verwijderen",
            description: "Deze actie kan niet ongedaan worden gemaakt. De gebruiker wordt soft verwijderd.",
            confirm_warning: "Weet u zeker dat u deze gebruiker wilt verwijderen?",
            confirm_note: "De gebruiker wordt gedeactiveerd en gemarkeerd als verwijderd",
            delete: "Gebruiker Verwijderen",
            deactivate_title: "Gebruikerstoegang Deactiveren",
            deactivate_description: "Deze actie zal de toegang van de gebruiker tot het systeem verwijderen terwijl alle gegevens behouden blijven",
            view_consequences: "Consequenties Bekijken",
            understand_consequences: "Ik begrijp de consequenties",
            acknowledge_text: "Ik erken dat deze gebruiker toegang tot het systeem en alle bijbehorende privileges zal verliezen",
            type_confirmation: "Typ \"DELETE USER\" om deze actie te bevestigen:",
            confirmation_placeholder: "DELETE USER",
            confirmation_help: "Deze bevestiging zorgt ervoor dat u begrijpt welke actie wordt uitgevoerd",
            deactivate_user: "Gebruiker Deactiveren",
            deactivating: "Deactiveren...",
            consequences: {
              login_access: "Inlogtoegang Ingetrokken",
              login_access_desc: "Gebruiker kan niet meer authenticeren of toegang krijgen tot het systeem",
              data_preservation: "Gegevensbehoud", 
              data_preservation_desc: "Alle historische records, subsidies en rapporten worden bewaard",
              role_assignments: "Roltoewijzingen",
              role_assignments_desc: "Alle roltoewijzingen worden opgeschort maar kunnen worden hersteld"
            },
            soft_delete: {
              title: "Soft Delete Operatie",
              description: "Dit is een omkeerbare operatie. Het gebruikersaccount wordt gemarkeerd als inactief, waardoor systeemtoegang wordt voorkomen terwijl alle gegevensintegriteit behouden blijft. Het account kan op elk moment door een beheerder worden gereactiveerd."
            }
          },
          user_details: {
            title: "Gebruikersdetails",
            description: "Volledige gebruikersinformatie en geschiedenis",
            basic_info: "Basisinformatie",
            contact_info: "Contactinformatie",
            system_info: "Systeeminformatie",
            roles_permissions: "Rollen & Machtigingen",
            history: "Geschiedenis"
          }
        },
        toasts: {
          user_created: "Gebruiker succesvol aangemaakt",
          user_updated: "Gebruiker succesvol bijgewerkt",
          user_deleted: "Gebruiker succesvol verwijderd",
          user_activated: "Gebruiker succesvol geactiveerd",
          user_deactivated: "Gebruiker succesvol gedeactiveerd",
          role_assigned: "Rol succesvol toegewezen",
          role_removed: "Rol succesvol verwijderd",
          creating_user: "Gebruiker aanmaken...",
          updating_user: "Gebruiker bijwerken...",
          deleting_user: "Gebruiker verwijderen...",
          user_create_failed: "Kon gebruiker niet aanmaken",
          user_update_failed: "Kon gebruiker niet bijwerken",
          user_delete_failed: "Kon gebruiker niet verwijderen"
        },
        profile: {
          title: "Gebruikersprofiel",
          subtitle: "Volledige gebruikersinformatie en activiteitsoverzicht",
          analytics: {
            title: "Activiteitsanalyse",
            subtitle: "Volg gebruikersactiviteitstrends over tijd",
            subsidy_trends: "Subsidieaanvraag Trends",
            subsidy_description: "Maandelijkse subsidieaanvraagactiviteit",
            event_trends: "Evenementdeelname Trends", 
            event_description: "Maandelijkse evenementregistratie en aanwezigheid",
            report_trends: "Rapportindiening Trends",
            report_description: "Kwartaal- en jaarrapportindieningen",
            communication_trends: "Communicatieactiviteit Trends",
            communication_description: "Maandelijkse communicatiepatronen"
          },
          sections: {
            personal_info: "Persoonlijke Informatie",
            system_access: "Systeemtoegang",
            quick_actions: "Snelle Acties",
            recent_activity: "Recente Activiteit",
            organizational_context: "Organisatorische Context"
          },
          stats: {
            subsidies: "Subsidies",
            events: "Evenementen", 
            communications: "Communicaties",
            reports: "Rapporten",
            total_requests: "Totaal Aanvragen",
            approved: "Goedgekeurd",
            registered: "Geregistreerd",
            upcoming: "Komend",
            total: "Totaal",
            authored: "Geschreven",
            annual_reports: "Jaarrapporten",
            department: "Afdeling"
          },
          actions: {
            send_message: "Bericht Versturen",
            view_subsidies: "Subsidies Bekijken",
            view_events: "Evenementen Bekijken", 
            view_communications: "Communicaties Bekijken",
            view_reports: "Rapporten Bekijken",
            view_contact: "Contact Bekijken",
            edit_user: "Gebruiker Bewerken",
            delete_user: "Gebruiker Verwijderen",
            back_to_users: "Terug naar Gebruikers"
          },
          tabs: {
            subsidies: "Subsidies",
            events: "Evenementen",
            reports: "Rapporten",
            communications: "Communicaties"
          },
          tables: {
            recent_subsidies: "Recente Subsidieaanvragen",
            recent_events: "Recente Evenementregistraties",
            recent_reports: "Recente Rapportindieningen", 
            recent_communications: "Recente Communicaties",
            description: "Beschrijving",
            amount: "Bedrag",
            status: "Status",
            date: "Datum",
            event: "Evenement",
            type: "Type",
            title: "Titel",
            priority: "Prioriteit",
            report_id: "Rapport ID",
            department: "Afdeling",
            no_data: "Geen gegevens gevonden"
          },
          contact: {
            title: "Contactinformatie",
            description: "Contactgegevens voor",
            primary_contact: "Primair Contact",
            address: "Adres",
            primary_email: "Primair E-mail",
            primary_phone: "Primaire Telefoon",
            mobile: "Mobiel",
            website: "Website",
            notes: "Notities",
            close: "Sluiten"
          },
          message: {
            title: "Direct Bericht Versturen",
            description: "Verstuur een direct bericht naar",
            subject: "Onderwerp",
            message: "Bericht",
            subject_placeholder: "Berichtonderwerp...",
            message_placeholder: "Typ je bericht...",
            cancel: "Annuleren",
            send: "Bericht Versturen"
          },
          annual_report: {
            title: "Jaarlijks Subsidierapport",
            description: "Uitgebreid overzicht van subsidieaanvragen en gebruik",
            total_requested: "Totaal Aangevraagd",
            approved_amount: "Goedgekeurd Bedrag", 
            utilization_rate: "Gebruikspercentage",
            pending_requests: "Hangende Aanvragen"
          }
        },
        chat: {
          no_messages_title: "Nog geen berichten",
          no_messages_description: "Begin een gesprek met {name} door hieronder een bericht te sturen",
          quick_templates: "Snelle berichtsjablonen",
          message_placeholder: "Typ hier je bericht...",
          send_hint: "Druk op Ctrl+Enter om te verzenden",
          sending_message: "Bericht versturen...",
          message_sent: "Bericht succesvol verzonden",
          send_failed: "Kon bericht niet verzenden",
          errors: {
            empty_message: "Voer een bericht in",
            file_too_large: "Bestand is te groot. Maximale grootte is 10MB"
          },
          templates: {
            meeting_request: "Vergaderverzoek",
            subsidy_follow_up: "Subsidie Opvolging", 
            event_invitation: "Evenementuitnodiging",
            document_request: "Documentverzoek"
          },
          attachments: "Bijlagen",
          drop_files: "Sleep bestanden om bij te voegen",
          status: {
            sent: "Verzonden",
            delivered: "Afgeleverd",
            read: "Gelezen",
            online: "Online",
            offline: "Offline"
          }
        }
      },
      annual_budget: {
        title: "Jaarbegroting Beheer",
        subtitle: "Beheer begrotingsaanvragen en goedkeuringen voor alle organisatie-entiteiten",
        messages: {
          refresh_success: "Begrotingsgegevens succesvol vernieuwd",
          refreshing: "Begrotingsgegevens vernieuwen...",
          refresh_error: "Kon begrotingsgegevens niet vernieuwen"
        },
        buttons: {
          new_budget_request: "Nieuwe Begrotingsaanvraag",
          refresh: "Vernieuwen",
          add_year: "Jaar Toevoegen"
        },
        year_filter: {
          title: "Begrotingsjaar",
          subtitle_single: "{{count}} aanvraag voor {{year}}",
          subtitle_plural: "{{count}} aanvragen voor {{year}}"
        },
        kpi_cards: {
          total_institution_budget: {
            title: "Totaal Instellingsbudget",
            subtitle: "Budget voor {{year}}",
            subtitle_not_set: "Klik om budget voor {{year}} in te stellen",
            not_set: "Niet Ingesteld",
            trend: "vs vorig jaar"
          },
          total_allocated: {
            title: "Totaal Toegewezen",
            subtitle: "Toegewezen aan afdelingen",
            trend: "vs vorig jaar"
          },
          total_spent: {
            title: "Totaal Uitgegeven",
            subtitle: "Huidige uitgaven",
            trend: "vs vorige maand"
          },
          budget_remaining: {
            title: "Resterend Budget",
            subtitle_available: "Beschikbaar voor toewijzing",
            subtitle_deficit: "Budget tekort",
            trend: "vs vorig jaar"
          },
          budget_utilization: {
            title: "Budgetbenutting",
            subtitle: "{{count}} actieve afdelingen",
            trend: "vs vorig jaar"
          }
        },
        charts: {
          budget_analytics: {
            title: "Budget Analyse Overzicht"
          },
          spending_over_time: {
            title: "Departement Uitgaven in de Tijd",
            subtitle: "Uitgaventrends voor {{year}}",
            time_ranges: {
              "12m": "Laatste 12 maanden",
              "6m": "Laatste 6 maanden",
              "3m": "Laatste 3 maanden"
            },
            chart_types: {
              area: "Area",
              bar: "Balk"
            }
          },
          budget_distribution: {
            title: "Instelling Budgetverdeling {{year}}",
            subtitle: "Totaal budget vs toegewezen aan afdelingen",
            label: {
              allocated: "Toegewezen",
              percentage_text: "Toegewezen",
              total_budget: "Totaal Budget"
            },
            legend: {
              allocated: "Toegewezen",
              remaining: "Resterend"
            }
          },
          department_spending: {
            title: "Afdelingsuitgaven"
          }
        },
        table: {
          title: "Budget Beheertabel",
          subtitle: "Beheer begrotingsaanvragen, vergrendel/ontgrendel budgetten en volg uitgaven voor alle entiteiten",
          title_departments: "Afdelingsbudgetten",
          subtitle_departments: "Beheer jaarlijkse budgetten voor alle institutionele afdelingen",
          headers: {
            entity_name: "Naam Entiteit",
            department_name: "Afdelingsnaam",
            entity_type: "Type",
            budget_total: "Totaal Budget",
            spent_amount: "Totaal Uitgegeven",
            usage_percentage: "Gebruik %",
            lock_status: "Vergrendelstatus",
            budget_status: "Budgetstatus",
            actions: "Acties",
            allocated_amount: "Totaal bedrag"
          },
          lock_tooltips: {
            locked: "Klik om te ontgrendelen",
            unlocked: "Klik om te vergrendelen",
            disabled: "Budgetrecord ontbreekt"
          },
          lock_actions: {
            lock: "Budget vergrendelen",
            unlock: "Budget ontgrendelen"
          },
          budget_status_labels: {
            completed: "Voltooid",
            missing: "Ontbreekt"
          },
          actions_menu: {
            manage: "Budget Beheren",
            register: "Budget Registreren",
            lock: "Budget Vergrendelen",
            unlock: "Budget Ontgrendelen",
            approve: "Budget Goedkeuren",
            reject: "Budget Afwijzen",
            request_revision: "Revisie Aanvragen",
            delete: "Budget Verwijderen"
          }
        },
        modals: {
          add: {
            title: "Jaarbegroting Toevoegen",
            description: "Maak een nieuwe jaarbegroting voor de instelling"
          },
          edit: {
            title: "Jaarbegroting Bewerken",
            description: "Werk jaarbegroting informatie bij"
          },
          steps: {
            basic_information: "Begroting Overzicht",
            basic_information_desc: "Jaar, geplande begroting en huidige status",
            financial_details: "Financiële Details",
            financial_details_desc: "Uitgaven, saldo en financiële tracking",
            additional_info: "Aanvullende Informatie",
            additional_info_desc: "Opmerkingen, goedkeuringen en commentaren"
          },
          fields: {
            year: "Begrotingsjaar",
            year_placeholder: "Voer begrotingsjaar in (bijv. 2024)",
            year_help: "Het boekjaar waarop deze begroting betrekking heeft",
            planned_budget: "Geplande Begroting",
            planned_budget_placeholder: "Voer geplande begrotingsbedrag in",
            total_expenses: "Totale Uitgaven",
            total_expenses_placeholder: "Voer totale uitgaven tot nu toe in",
            balance: "Huidig Saldo",
            balance_placeholder: "Automatisch berekend",
            balance_help: "Saldo wordt automatisch berekend als Geplande Begroting - Totale Uitgaven",
            status: "Begrotingsstatus",
            status_placeholder: "Selecteer begrotingsstatus",
            status_help: "Huidige fase van het begrotingsproces",
            notes: "Opmerkingen",
            notes_placeholder: "Aanvullende opmerkingen of commentaren over deze begroting...",
            no_notes: "Geen opmerkingen verstrekt",
            approved_by: "Goedgekeurd Door",
            approved_by_placeholder: "Selecteer goedkeurende gebruiker",
            available_budget_hint: "Beschikbaar budget"
          },
          status_options: {
            planned: "Gepland",
            approved: "Goedgekeurd",
            in_progress: "In Uitvoering",
            closed: "Afgesloten"
          },
          validation: {
            year_required: "Begrotingsjaar is verplicht",
            year_invalid: "Voer een geldig jaar in (bijv. 2024)",
            year_min: "Jaar moet 2000 of later zijn",
            year_max: "Jaar kan niet meer dan 10 jaar in de toekomst zijn",
            planned_budget_required: "Geplande begroting is verplicht",
            planned_budget_invalid: "Voer een geldig begrotingsbedrag in",
            planned_budget_min: "Geplande begroting moet groter zijn dan 0",
            exceeds_available_budget: "Begroting overschrijdt beschikbaar bedrag: {{available}}",
            total_expenses_invalid: "Voer een geldig uitgavenbedrag in",
            total_expenses_negative: "Totale uitgaven kunnen niet negatief zijn",
            reserved_invalid: "Voer een geldig gereserveerd bedrag in",
            reserved_negative: "Gereserveerd bedrag kan niet negatief zijn",
            status_required: "Begrotingsstatus is verplicht",
            fix_errors: "Los de fouten op voordat u doorgaat"
          },
          buttons: {
            previous: "Vorige",
            next: "Volgende",
            cancel: "Annuleren",
            save: "Begroting Opslaan",
            update: "Begroting Bijwerken",
            close: "Sluiten",
            edit: "Bewerken"
          },
          summary: {
            title: "Begrotingsoverzicht",
            planned: "Gepland",
            expenses: "Uitgaven",
            balance: "Saldo",
            sepent: "Uitgegeven",
            remaining: "Resterend",
            available: "Beschikbaar"
          },
          review: {
            title: "Controleren & Bevestigen"
          },
          system_info: {
            title: "Systeeminformatie",
            created_at: "Aangemaakt op",
            updated_at: "Bijgewerkt op"
          },
          lock_tooltip: {
            locked: "Ontgrendel eerst om te kunnen bewerken",
            unlocked: "Ontgrendeld - Kan worden bewerkt"
          },
          status: {
            positive: "Positief",
            deficit: "Tekort",
            deleted: "Verwijderd"
          },
          messages: {
            saving: "Opslaan...",
            updating: "Bijwerken...",
            loading: "Laden...",
            saved: "Jaarbegroting succesvol opgeslagen!",
            updated: "Jaarbegroting succesvol bijgewerkt!",
            save_failed: "Opslaan van jaarbegroting mislukt",
            update_failed: "Bijwerken van jaarbegroting mislukt",
            lock_success: "Begroting succesvol vergrendeld",
            unlock_success: "Begroting succesvol ontgrendeld",
            approve_success: "Begroting succesvol goedgekeurd",
            reject_success: "Begroting succesvol afgewezen",
            revision_success: "Revisie succesvol aangevraagd",
            delete_success: "Begroting succesvol verwijderd",
            lock_error: "Begroting vergrendeling wijzigen mislukt",
            approve_error: "Begroting goedkeuren mislukt",
            reject_error: "Begroting afwijzen mislukt",
            revision_error: "Revisie aanvragen mislukt",
            delete_error: "Begroting verwijderen mislukt",
            institution_budget_not_found: "Instellingsbudget niet gevonden voor het geselecteerde jaar",
            budget_locked_edit: "Begroting is vergrendeld. Ontgrendel eerst om te bewerken.",
            cannot_add_year_beyond: "Kan geen jaren toevoegen na {{maxYear}}",
            year_already_exists: "Dit jaar bestaat al",
            department_budget_save_failed: "Opslaan van afdelingsbudget mislukt. Probeer het opnieuw.",
            institution_budget_create_failed: "Aanmaken van instellingsbudget mislukt. Probeer het opnieuw.",
            budget_id_required: "Begrotings-ID is vereist voor updates",
            no_budget_selected: "Geen begroting geselecteerd voor update",
            budget_update_failed: "Bijwerken van begroting mislukt. Probeer het opnieuw.",
            year_added_success: "Jaar {{year}} succesvol toegevoegd! U kunt het nu selecteren en budgetten aanmaken.",
            department_budget_updated: "Afdelingsbudget succesvol bijgewerkt!",
            department_budget_created: "Budget voor {{departmentName}} succesvol aangemaakt!",
            institution_budget_created: "Instellingsbudget voor {{year}} succesvol aangemaakt!",
            budget_updated: "Begroting succesvol bijgewerkt!"
          },
          lock_institution: {
            title: "Bevestig Instelling Vergrendeling",
            description: "Sommige afdelingen hebben nog geen budgetten. Het vergrendelen van het instellingsbudget zal ook alle bestaande afdelingsbudgetten vergrendelen. Weet je zeker dat je wilt doorgaan?"
          },
          delete: {
            title: "Begroting Verwijderen",
            description: "Deze actie zal de begroting en alle gerelateerde gegevens permanent verwijderen.",
            view_consequences: "Bekijk Gevolgen",
            understand_consequences: "Ik begrijp de gevolgen van het verwijderen van deze begroting",
            acknowledge_text: "Ik bevestig dat alle begrotingsgegevens en geschiedenis permanent verloren gaan.",
            type_confirmation: "Typ \"DELETE BUDGET\" om te bevestigen:",
            confirmation_placeholder: "DELETE BUDGET",
            confirmation_help: "Typ exact zoals hierboven getoond om de verwijderknop in te schakelen",
            delete_budget: "Begroting Verwijderen",
            consequences: {
              financial_record: "Verlies van Financiële Gegevens",
              financial_record_desc: "Alle financiële gegevens, transacties en begrotingsgeschiedenis worden permanent verwijderd.",
              historical_data: "Verlies van Historische Gegevens",
              historical_data_desc: "Begrotingstrends, vergelijkingen en historische analyses worden beïnvloed.",
              reporting_impact: "Impact op Rapportage",
              reporting_impact_desc: "Financiële rapporten en jaarverklaringen zullen deze begrotingsgegevens niet meer bevatten.",
              approval_chain: "Verlies van Goedkeuringsketen",
              approval_chain_desc: "Alle goedkeuringsgeschiedenis, beoordelaars en autorisatierecords worden verwijderd."
            },
            permanent_warning: {
              title: "Dit is een permanente actie",
              description: "Begrotingsrecords kunnen niet worden hersteld zodra ze zijn verwijderd. Alle gegevens gaan permanent verloren."
            },
            messages: {
              deleting: "Verwijderen...",
              deleted: "Begroting succesvol verwijderd",
              delete_failed: "Verwijderen van begroting mislukt"
            }
          }
        }
      },
      subsidy: subsidyManagementTranslations.nl,
      projectRegister: projectRegisterTranslations.nl
    }
  },
  pt: {
    translation: {
      ...projectTranslations.pt,
      common: {
        ...projectTranslations.pt.common,
        language: "Idioma",
        profile: "Perfil",
        loading: "Carregando...",
        error: "Erro",
        success: "Sucesso",
        confirm: "Confirmar",
        impact: "Impacto da Ação",
        consequences: "Consequências desta ação",
        undone: "Esta ação não pode ser desfeita",
        riskAware: "Você está ciente dos riscos",
        approve: "Aprovar",
        reject: "Rejeitar",
        cancel: "Cancelar",
        save: "Salvar",
        edit: "Editar",
        delete: "Excluir",
        view: "Visualizar",
        active: "Ativo",
        inactive: "Inativo",
        status: "Status",
        actions: "Ações",
        members: "Membros",
        budget: "Orçamento",
        coming_soon: "Em Breve",
        coming_soon_description: "Este recurso está em desenvolvimento e estará disponível em breve.",
        theme: "Tema",
        light_mode: "Claro",
        dark_mode: "Escuro",
        theme_light_activated: "Modo claro ativado",
        theme_dark_activated: "Modo escuro ativado",
        invite: "Convidar",
        structure_organization: "Estrutura Organizacional",
        annual_budget: "Orçamento Anual",
        data_loaded: "Dados carregados com sucesso",
        see_all_churches: "Ver Todas as Igrejas",
        all_members_associated_with: "Todos os membros associados com",
        all_departments_within: "Todos os departamentos dentro de",
        view_contact: "Ver Contato",
        add: "Adicionar"
      },
      privacy: {
        protected_content: "Conteúdo Protegido",
        contact_admin: "Entre em contato com o administrador para acesso"
      },
      activities: {
        modal: {
          title: "Detalhes da Atividade",
          edit_title: "Editar Atividade",
          status: "Status",
          priority: "Prioridade", 
          category: "Categoria",
          budget: "Orçamento",
          subsidy: "Subsídio",
          description: "Descrição",
          documents: "Documentos",
          system_info: "Informações do Sistema",
          created_at: "Criado em",
          updated_at: "Atualizado em",
          created_by: "Criado por",
          updated_by: "Atualizado por",
          activity_id: "ID da Atividade",
          total_budget: "Orçamento Total",
          rich_editor: "Editor Rico",
          click_to_edit: "Clique para editar descrição",
          drop_files: "Arraste arquivos aqui ou clique para enviar",
          supported_formats: "Suporta PDF e imagens até 10MB",
          no_documents: "Nenhum documento anexado",
          use_button_above: "Use o botão acima para adicionar documentos",
          save_changes: "Salvar Alterações",
          unsaved_changes: "Há alterações não salvas",
          unsaved_changes_and_files: "Alterações não salvas e {{count}} arquivos pendentes",
          save_and_upload: "Salvar e Enviar ({{count}})",
          saving_and_uploading: "Salvando...",
          close: "Fechar",
          assignees: "Responsáveis",
          assignees_count: "{{count}} responsáveis",
          select_assignees: "Selecionar Responsáveis",
          search_user: "Pesquisar usuário...",
          click_to_add_description: "Clique aqui para adicionar uma descrição...",
          metadata: "Metadados",
          history: "Histórico",
          technical_details: "Detalhes técnicos e metadados da atividade",
          change_history: "Histórico de alterações da atividade",
          tooltips: {
            status: "Status atual da atividade",
            priority: "Nível de urgência da atividade", 
            category: "Tipo de atividade",
            subsidy: "Se esta atividade é subsidiada ou não",
            total_requested_amount: "Valor total solicitado para esta atividade"
          },
          status_labels: {
            planning: "Planejamento",
            in_progress: "Em Progresso",
            completed: "Concluído",
            pending_approval: "Aguardando Aprovação",
            cancelled: "Cancelado"
          },
          priority_labels: {
            urgent: "Urgente",
            high: "Alto",
            medium: "Médio",
            low: "Baixo"
          },
          tag_labels: {
            reform: "Reforma",
            equipment: "Equipamento",
            materials: "Materiais",
            training: "Treinamento",
            travel: "Viagem",
            event: "Evento",
            transport: "Transporte",
            marketing: "Marketing",
            services: "Serviços",
            feeding: "Alimentação",
            accommodation: "Acomodação"
          },
          status_options: {
            todo: "A Fazer",
            in_progress: "Em Progresso", 
            completed: "Concluído",
            on_hold: "Pausado"
          },
          priority_options: {
            urgent: "Urgente",
            high: "Alto",
            medium: "Médio", 
            low: "Baixo"
          },
          done: "Concluído",
          no_category: "Sem categoria"
        },
        documents: {
          title: "Arquivos Anexados",
          uploading: "Enviando...",
          upload_files: "Enviar {{count}} arquivo(s)",
          files_added: "{{count}} arquivo(s) adicionado(s)",
          files_rejected: "Alguns arquivos foram rejeitados (apenas PDF e imagens até 10MB)",
          drag_or_click: "Arraste arquivos aqui ou clique para selecionar",
          supported_formats: "Formatos suportados: JPG, PNG, PDF (máx. 10MB)",
          pending_upload: "Arquivos pendentes de upload:",
          pending_upload_count: "{{count}} arquivos pendentes de upload",
          loading: "Carregando documentos...",
          uploaded_documents: "Documentos enviados ({{count}}):",
          uploaded_on: "Enviado em",
          validated: "Validado",
          pending: "Pendente",
          download_document: "Baixar documento",
          validate_document: "Validar documento",
          delete_confirm: "Tem certeza que deseja excluir este documento?",
          delete_document: "Excluir documento",
          no_documents: "Nenhum documento anexado ainda",
          drag_to_add: "Arraste arquivos ou clique em \"Enviar\" para adicionar",
          no_files_attached: "Nenhum arquivo anexado",
          files_will_upload_on_save: "Arquivos serão enviados automaticamente ao salvar",
          uploading_files: "Enviando arquivos...",
          files_uploaded_successfully: "Arquivos enviados com sucesso"
        }
      },
      annual_budget: {
        title: "Gestão de Orçamento Anual",
        subtitle: "Gerencie solicitações de orçamento e aprovações em todas as entidades organizacionais",
        buttons: {
          new_budget_request: "Nova Solicitação de Orçamento",
          refresh: "Atualizar",
          add_year: "Adicionar Ano"
        },
        year_filter: {
          title: "Ano do Orçamento",
          subtitle_single: "{{count}} solicitação para {{year}}",
          subtitle_plural: "{{count}} solicitações para {{year}}"
        },
        kpi_cards: {
          total_institution_budget: {
            title: "Orçamento Total da Instituição",
            subtitle: "Orçamento para {{year}}",
            subtitle_not_set: "Clique para definir orçamento para {{year}}",
            not_set: "Não Definido",
            trend: "vs ano passado"
          },
          total_allocated: {
            title: "Total Alocado",
            subtitle: "Alocado aos departamentos",
            trend: "vs ano passado"
          },
          total_spent: {
            title: "Total Gasto",
            subtitle: "Gasto atual",
            trend: "vs último mês"
          },
          budget_remaining: {
            title: "Orçamento Restante",
            subtitle_available: "Disponível para alocação",
            subtitle_deficit: "Déficit orçamentário",
            trend: "vs ano passado"
          },
          budget_utilization: {
            title: "Utilização do Orçamento",
            subtitle: "{{count}} departamentos ativos",
            trend: "vs ano passado"
          }
        },
        charts: {
          budget_analytics: {
            title: "Visão Geral da Análise de Orçamento"
          },
          spending_over_time: {
            title: "Gastos por Departamento ao Longo do Tempo",
            subtitle: "Mostrando tendências de gastos para {{year}}",
            time_ranges: {
              "12m": "Últimos 12 meses",
              "6m": "Últimos 6 meses",
              "3m": "Últimos 3 meses"
            },
            chart_types: {
              area: "Área",
              bar: "Barra"
            }
          },
          budget_distribution: {
            title: "Distribuição do Orçamento Institucional {{year}}",
            subtitle: "Orçamento total vs alocado para departamentos",
            label: {
              allocated: "Alocado",
              percentage_text: "Alocado",
              total_budget: "Orçamento Total"
            },
            legend: {
              allocated: "Alocado",
              remaining: "Restante"
            }
          },
          department_spending: {
            title: "Gastos por Departamento"
          }
        },
        table: {
          title: "Tabela de Gestão de Orçamento",
          subtitle: "Gerencie solicitações de orçamento, bloqueie/desbloqueie orçamentos e acompanhe gastos em todas as entidades",
          title_departments: "Orçamentos por Departamento",
          subtitle_departments: "Gerencie orçamentos anuais para todos os departamentos institucionais",
          headers: {
            entity_name: "Nome da Entidade",
            department_name: "Nome do Departamento",
            entity_type: "Tipo",
            budget_total: "Orçamento Total",
            spent_amount: "Total Gasto",
            usage_percentage: "Uso %",
            lock_status: "Status de Bloqueio",
            budget_status: "Status do Orçamento",
            actions: "Ações"
          },
          lock_tooltips: {
            locked: "Clique para desbloquear",
            unlocked: "Clique para bloquear",
            disabled: "Registro de orçamento ausente"
          },
          lock_actions: {
            lock: "Bloquear orçamento",
            unlock: "Desbloquear orçamento"
          },
          budget_status_labels: {
            completed: "Concluído",
            missing: "Ausente"
          },
          actions_menu: {
            manage: "Gerenciar Orçamento",
            register: "Registrar Orçamento",
            lock: "Bloquear Orçamento",
            unlock: "Desbloquear Orçamento",
            approve: "Aprovar Orçamento",
            reject: "Rejeitar Orçamento",
            request_revision: "Solicitar Revisão",
            delete: "Excluir Orçamento"
          }
        },
        modals: {
          add: {
            title: "Adicionar Orçamento Anual",
            description: "Criar um novo orçamento anual para a instituição"
          },
          edit: {
            title: "Editar Orçamento Anual",
            description: "Atualizar informações do orçamento anual"
          },
          steps: {
            basic_information: "Visão Geral do Orçamento",
            basic_information_desc: "Ano, orçamento planejado e status atual",
            financial_details: "Detalhes Financeiros",
            financial_details_desc: "Despesas, saldo e acompanhamento financeiro",
            additional_info: "Informações Adicionais",
            additional_info_desc: "Notas, aprovações e comentários"
          },
          fields: {
            year: "Ano do Orçamento",
            year_placeholder: "Digite o ano do orçamento (ex: 2024)",
            year_help: "O ano fiscal ao qual este orçamento se aplica",
            planned_budget: "Orçamento Planejado",
            planned_budget_placeholder: "Digite o valor do orçamento planejado",
            total_expenses: "Total de Despesas",
            total_expenses_placeholder: "Digite o total de despesas até o momento",
            balance: "Saldo Atual",
            balance_placeholder: "Calculado automaticamente",
            balance_help: "Saldo é calculado automaticamente como Orçamento Planejado - Total de Despesas",
            status: "Status do Orçamento",
            status_placeholder: "Selecione o status do orçamento",
            status_help: "Estágio atual do processo orçamentário",
            notes: "Observações",
            notes_placeholder: "Observações ou comentários adicionais sobre este orçamento...",
            no_notes: "Nenhuma observação fornecida",
            approved_by: "Aprovado Por",
            approved_by_placeholder: "Selecione o usuário aprovador",
            available_budget_hint: "Orçamento disponível"
          },
          status_options: {
            planned: "Planejado",
            approved: "Aprovado",
            in_progress: "Em Andamento",
            closed: "Fechado"
          },
          validation: {
            year_required: "Ano do orçamento é obrigatório",
            year_invalid: "Digite um ano válido (ex: 2024)",
            year_min: "Ano deve ser 2000 ou posterior",
            year_max: "Ano não pode ser mais de 10 anos no futuro",
            planned_budget_required: "Orçamento planejado é obrigatório",
            planned_budget_invalid: "Digite um valor de orçamento válido",
            planned_budget_min: "Orçamento planejado deve ser maior que 0",
            exceeds_available_budget: "Orçamento excede o valor disponível: {{available}}",
            total_expenses_invalid: "Digite um valor de despesa válido",
            total_expenses_negative: "Total de despesas não pode ser negativo",
            reserved_invalid: "Digite um valor reservado válido",
            reserved_negative: "Valor reservado não pode ser negativo",
            status_required: "Status do orçamento é obrigatório",
            fix_errors: "Corrija os erros antes de continuar"
          },
          buttons: {
            previous: "Anterior",
            next: "Próximo",
            cancel: "Cancelar",
            save: "Salvar Orçamento",
            update: "Atualizar Orçamento",
            close: "Fechar",
            edit: "Editar"
          },
          summary: {
            title: "Resumo do Orçamento",
            planned: "Planejado",
            expenses: "Despesas",
            balance: "Saldo"
          },
          review: {
            title: "Revisar & Confirmar"
          },
          system_info: {
            title: "Informações do Sistema",
            created_at: "Criado em",
            updated_at: "Atualizado em"
          },
          lock_tooltip: {
            locked: "Desbloqueie primeiro para poder editar",
            unlocked: "Desbloqueado - Pode ser editado"
          },
          status: {
            positive: "Positivo",
            deficit: "Déficit",
            deleted: "Excluído"
          },
          messages: {
            saving: "Salvando...",
            updating: "Atualizando...",
            loading: "Carregando...",
            saved: "Orçamento anual salvo com sucesso!",
            updated: "Orçamento anual atualizado com sucesso!",
            save_failed: "Falha ao salvar orçamento anual",
            update_failed: "Falha ao atualizar orçamento anual",
            lock_success: "Orçamento bloqueado com sucesso",
            unlock_success: "Orçamento desbloqueado com sucesso",
            approve_success: "Orçamento aprovado com sucesso",
            reject_success: "Orçamento rejeitado com sucesso",
            revision_success: "Revisão solicitada com sucesso",
            delete_success: "Orçamento excluído com sucesso",
            lock_error: "Falha ao alterar bloqueio do orçamento",
            approve_error: "Falha ao aprovar orçamento",
            reject_error: "Falha ao rejeitar orçamento",
            revision_error: "Falha ao solicitar revisão",
            delete_error: "Falha ao excluir orçamento",
            institution_budget_not_found: "Orçamento da instituição não encontrado para o ano selecionado",
            budget_locked_edit: "Orçamento está bloqueado. Desbloqueie primeiro para editar.",
            cannot_add_year_beyond: "Não é possível adicionar anos além de {{maxYear}}",
            year_already_exists: "Este ano já existe",
            department_budget_save_failed: "Falha ao salvar orçamento do departamento. Tente novamente.",
            institution_budget_create_failed: "Falha ao criar orçamento da instituição. Tente novamente.",
            budget_id_required: "ID do orçamento é obrigatório para atualizações",
            no_budget_selected: "Nenhum orçamento selecionado para atualização",
            budget_update_failed: "Falha ao atualizar orçamento. Tente novamente.",
            year_added_success: "Ano {{year}} adicionado com sucesso! Agora você pode selecioná-lo e criar orçamentos.",
            department_budget_updated: "Orçamento do departamento atualizado com sucesso!",
            department_budget_created: "Orçamento para {{departmentName}} criado com sucesso!",
            institution_budget_created: "Orçamento da instituição para {{year}} criado com sucesso!",
            budget_updated: "Orçamento atualizado com sucesso!"
          },
          lock_institution: {
            title: "Confirmar Bloqueio da Instituição",
            description: "Alguns departamentos ainda não possuem orçamentos. Bloquear o orçamento da instituição também bloqueará todos os orçamentos existentes dos departamentos. Tem certeza de que deseja continuar?"
          },
          delete: {
            title: "Excluir Orçamento",
            description: "Esta ação excluirá permanentemente o orçamento e todos os dados relacionados.",
            view_consequences: "Ver Consequências",
            understand_consequences: "Compreendo as consequências de excluir este orçamento",
            acknowledge_text: "Reconheço que todos os dados do orçamento e histórico serão permanentemente perdidos.",
            type_confirmation: "Digite \"DELETE BUDGET\" para confirmar:",
            confirmation_placeholder: "DELETE BUDGET",
            confirmation_help: "Digite exatamente como mostrado acima para habilitar o botão de exclusão",
            delete_budget: "Excluir Orçamento",
            consequences: {
              financial_record: "Perda de Registro Financeiro",
              financial_record_desc: "Todos os registros financeiros, transações e histórico de orçamento serão removidos permanentemente.",
              historical_data: "Perda de Dados Históricos",
              historical_data_desc: "Tendências de orçamento, comparações e análises históricas serão afetadas.",
              reporting_impact: "Impacto em Relatórios",
              reporting_impact_desc: "Relatórios financeiros e declarações anuais não incluirão mais estes dados de orçamento.",
              approval_chain: "Perda da Cadeia de Aprovação",
              approval_chain_desc: "Todo histórico de aprovação, revisores e registros de autorização serão excluídos."
            },
            permanent_warning: {
              title: "Esta é uma ação permanente",
              description: "Registros de orçamento não podem ser recuperados após a exclusão. Todos os dados serão permanentemente perdidos."
            },
            messages: {
              deleting: "Excluindo...",
              deleted: "Orçamento excluído com sucesso",
              delete_failed: "Falha ao excluir orçamento"
            }
          }
        }
      },
      funding_rules: {
        create_modal: {
          title: "Nieuwe Regel Maken voor \"{{groupName}}\"",
          steps: {
            basic_info: "Basisinformatie",
            condition: "Voorwaarde Bouwen",
            review: "Controleren & Bevestigen"
          },
          progress_labels: {
            information: "Informatie",
            condition: "Voorwaarde",
            review: "Controleren"
          },
          step1: {
            rule_name_label: "Regelnaam",
            rule_name_placeholder: "bijv.: Maximaal budget per aanvraag",
            description_label: "Beschrijving (Optioneel)",
            description_placeholder: "Korte beschrijving van deze regel...",
            required: "*"
          },
          step2: {
            condition_type_label: "Welk type voorwaarde?",
            value_types: {
              amount: "Waarde ($)",
              percentage: "Percentage (%)",
              requests: "Aanvragen (#)"
            },
            operator_label: "Vergelijkingsoperator",
            operator_placeholder: "Selecteer een operator...",
            operators: {
              greater_than: {
                label: "Groter dan (>)",
                description: "Waarde moet groter zijn dan gespecificeerd"
              },
              less_than: {
                label: "Kleiner dan (<)",
                description: "Waarde moet kleiner zijn dan gespecificeerd"
              },
              equal_to: {
                label: "Gelijk aan (=)",
                description: "Waarde moet exact gelijk zijn"
              },
              between: {
                label: "Tussen (bereik)",
                description: "Waarde moet tussen twee getallen liggen"
              }
            },
            value_label: "Waarde",
            min_value_label: "Minimale waarde",
            max_value_label: "Maximale waarde",
            max_quantity_label: "Maximale hoeveelheid",
            period_label: "Tijdsperiode",
            period_placeholder: "Selecteer een periode...",
            periods: {
              month: {
                label: "Per maand",
                description: "Maandelijkse limiet"
              },
              quarter: {
                label: "Per kwartaal",
                description: "Kwartaallimiet (3 maanden)"
              },
              semester: {
                label: "Per semester",
                description: "Semesterlimiet (6 maanden)"
              },
              year: {
                label: "Per jaar",
                description: "Jaarlijkse limiet"
              }
            },
            scope_label: "Bereik",
            scope_placeholder: "Selecteer een bereik...",
            scopes: {
              per_user: {
                label: "Per gebruiker",
                description: "Individuele limiet per gebruiker"
              },
              total: {
                label: "In totaal",
                description: "Totale limiet voor alle gebruikers"
              }
            }
          },
          step3: {
            rule_name_label: "Regelnaam",
            condition_label: "Voorwaarde",
            description_label: "Beschrijving",
            preview_label: "Regelvoorbeeld:",
            preview_badges: {
              value: "waarde",
              percentage: "percentage",
              requests: "aanvragen",
              condition: "Voorwaarde"
            }
          },
          buttons: {
            back: "Terug",
            next: "Volgende",
            cancel: "Annuleren",
            create: "Regel Maken"
          },
          validation: {
            enter_name: "Voer een regelnaam in",
            enter_value: "Voer een waarde in voor de voorwaarde",
            enter_second_value: "Voer een tweede waarde in voor de 'tussen' voorwaarde",
            fill_required: "Vul alle verplichte velden in"
          },
          toasts: {
            created: "Regel succesvol aangemaakt",
            create_failed: "Kon regel niet aanmaken"
          },
          auto_description: {
            operators: {
              greater_than: "groter dan",
              less_than: "kleiner dan",
              equal_to: "gelijk aan",
              between: "tussen"
            },
            value_types: {
              amount: "waarde",
              percentage: "percentage",
              requests: "aanvragen"
            },
            periods: {
              month: "per maand",
              quarter: "per kwartaal",
              semester: "per semester",
              year: "per jaar"
            },
            per_user: "per gebruiker",
            in_total: "in totaal",
            maximum: "Maximum van",
            and: "en"
          }
        },
        edit_modal: {
          title: "Regel Bewerken \"{{ruleName}}\"",
          buttons: {
            update: "Regel Bijwerken"
          },
          toasts: {
            updated: "Regel succesvol bijgewerkt",
            update_failed: "Kon regel niet bijwerken"
          }
        },
        delete_modal: {
          title: "Regel Verwijderen",
          description: "Deze actie kan niet ongedaan worden gemaakt",
          confirm_message: "Weet u zeker dat u deze regel wilt verwijderen uit \"{{groupName}}\"?",
          rule_preview: {
            title: "Regel om te verwijderen:",
            condition: "Voorwaarde"
          },
          warning: {
            title: "Permanente Verwijdering",
            message: "Deze regel wordt permanent verwijderd en kan niet worden hersteld. Alle bijbehorende voorwaarden en configuraties gaan verloren."
          },
          understand_consequences: "Ik begrijp de gevolgen",
          acknowledge_text: "Ik erken dat deze regel permanent wordt verwijderd en dat deze actie onomkeerbaar is.",
          type_confirmation: "Typ \"delete rule\" om te bevestigen:",
          confirmation_placeholder: "delete rule",
          confirmation_help: "Typ exact \"delete rule\" (kleine letters) om verwijdering mogelijk te maken.",
          buttons: {
            cancel: "Annuleren",
            delete: "Regel Verwijderen",
            deleting: "Verwijderen..."
          },
          toasts: {
            deleting: "Regel wordt verwijderd...",
            deleted: "Regel succesvol verwijderd",
            delete_failed: "Kon regel niet verwijderen"
          }
        }
      },
      departments: {
        title: "Institutionele Afdelingen",
        subtitle: "Totaal afdelingen in de instelling",
        modals: {
          create: {
            title: "Afdeling Aanmaken",
            description: "Voeg een nieuwe afdeling toe aan uw organisatie"
          },
          edit: {
            title: "Afdeling Bewerken",
            description: "Bijwerken van afdeling informatie en contactgegevens"
          },
          delete: {
            deactivate_title: "Afdeling Deactiveren",
            deactivate_description: "Deze actie zal de afdeling en alle gerelateerde gegevens deactiveren. Gegevens blijven bewaard en kunnen worden hersteld.",
            deactivating: "Deactiveren...",
            deactivate_department: "Afdeling Deactiveren",
            view_consequences: "Gevolgen Bekijken",
            affected_components: "Beïnvloede Gegevens",
            understand_consequences: "Ik begrijp de gevolgen",
            acknowledge_text: "Ik erken dat deze actie de afdeling en alle gerelateerde gegevens zal deactiveren",
            type_confirmation: "Typ de bevestigingstekst om door te gaan",
            confirmation_placeholder: 'Typ: "delete department"',
            confirmation_help: "Deze actie kan niet gemakkelijk ongedaan worden gemaakt zonder tussenkomst van administrator",
            consequences: {
              projects_deleted: "Projecten & Activiteiten Verwijderd",
              projects_deleted_desc: "Alle projecten, activiteiten en gerelateerde gegevens worden gemarkeerd als verwijderd",
              users_unlinked: "Gebruikers Ontkoppeld van Afdeling",
              users_unlinked_desc: "Gebruikers van de afdeling worden uit deze afdeling verwijderd maar blijven in de instelling",
              data_preservation: "Gegevensbewaring & Herstel",
              data_preservation_desc: "Alle gegevens blijven in de database en kunnen door beheerders worden hersteld",
              budget_deleted: "Budget- & Financiële Gegevens Verwijderd",
              budget_deleted_desc: "Alle budgetten, subsidieverzoeken en financiële verslagen worden gemarkeerd als verwijderd"
            }
          }
        },
        steps: {
          step: "Stap",
          of: "van",
          step_1_title: "Basis Informatie",
          step_1_description: "Voer afdeling naam en beschrijving in",
          step_2_title: "Contact Informatie",
          step_2_description: "Voeg contactgegevens toe voor deze afdeling (optioneel)",
          step_3_title: "Controleren & Bevestigen",
          step_3_description: "Controleer de informatie voordat u de afdeling aanmaakt"
        },
        fields: {
          name: "Afdeling Naam",
          church: "Kerk",
          description: "Beschrijving",
          annual_budget: "Jaarlijks Budget",
          contact_name: "Contactnaam",
          contact_email: "Contact E-mail",
          contact_phone: "Telefoon",
          city: "Stad",
          is_institution_department: "Institutionele Afdeling",
          search_church: "Zoek kerk...",
          no_church_found: "Geen kerk gevonden."
        },
        department_type: {
          institutional_tooltip: "Afdeling direct gerelateerd aan de instelling",
          institutional_explanation_on: "Afdeling is direct gekoppeld aan de instelling, niet aan een specifieke kerk",
          institutional_explanation_off: "Afdeling moet gekoppeld worden aan een specifieke kerk"
        },
        placeholders: {
          name: "Voer afdeling naam in",
          church: "Selecteer kerk",
          description: "Beschrijf het doel en de activiteiten van de afdeling",
          annual_budget: "Voer jaarlijks budget in",
          contact_name: "Voer contactnaam in",
          contact_email: "contact@example.com",
          contact_phone: "+31 123 456 789",
          city: "Voer stad in"
        },
        labels: {
          department: "Afdeling",
          contact: "Contact",
          type: "Type",
          institutional: "Institutioneel",
          church_dept: "Kerkafdeling"
        },
        sections: {
          basic_info: "Basis Informatie",
          contact_info: "Contact Informatie",
          review: "Controleren & Bevestigen"
        },
        buttons: {
          previous: "Terug",
          next: "Doorgaan",
          skip: "Voorlopig overslaan",
          cancel: "Annuleren",
          save: "Opslaan",
          create: "Afdeling Aanmaken",
          update: "Afdeling Bijwerken",
          delete: "Afdeling Verwijderen",
          creating: "Aanmaken...",
          updating: "Bijwerken...",
          deleting: "Verwijderen..."
        },
        validation: {
          name_required: "Afdeling naam is verplicht",
          name_min_length: "Afdeling naam moet minimaal 2 karakters zijn",
          church_required: "Kerk is verplicht voor kerkafdeling",
          description_required: "Beschrijving is verplicht",
          description_min_length: "Beschrijving moet minimaal 10 karakters zijn",
          contact_name_required: "Contactnaam is verplicht",
          email_required: "E-mail is verplicht",
          email_invalid: "Voer een geldig e-mailadres in",
          phone_required: "Telefoonnummer is verplicht",
          city_required: "Stad is verplicht",
          please_fix_errors: "Corrigeer de fouten voordat je doorgaat"
        },
        toasts: {
          creating: "Afdeling aanmaken...",
          created: "Afdeling succesvol aangemaakt",
          create_failed: "Kon afdeling niet aanmaken",
          updating: "Afdeling bijwerken...",
          updated: "Afdeling succesvol bijgewerkt",
          update_failed: "Kon afdeling niet bijwerken",
          deleting: "Afdeling deactiveren...",
          deleted: "Afdeling succesvol gedeactiveerd",
          delete_failed: "Kon afdeling niet deactiveren"
        },
        stats: {
          church: "Kerk",
          volunteers: "Vrijwilligers",
          budgets: "Budgetten",
          projects: "Projecten",
          documents: "Documenten",
          members: "Leden"
        },
        page: {
          title: "Institutionele Afdelingen",
          description: "Beheer afdelingen in uw instelling"
        }
      },
      users: {
        title: "Gebruikersbeheer",
        subtitle: "Beheer systeemgebruikers en hun toegang",
        table: {
          name: "Naam",
          email: "E-mail",
          institution: "Instelling",
          church: "Kerk",
          roles: "Rollen",
          created_at: "Aangemaakt",
          actions: "Acties",
          search_placeholder: "Zoek gebruikers...",
          no_results: "Geen gebruikers gevonden"
        },
        actions: {
          create_user: "Gebruiker Aanmaken",
          view_details: "Details Bekijken",
          edit_user: "Gebruiker Bewerken",
          assign_role: "Rol Toewijzen",
          remove_role: "Rol Verwijderen",
          delete_user: "Gebruiker Verwijderen"
        },
        modals: {
          create_user: {
            title: "Nieuwe Gebruiker Aanmaken",
            name: "Volledige Naam",
            email: "E-mailadres",
            institution: "Instelling",
            church: "Kerk",
            language: "Taalvoorkeur",
            roles: "Rollen Toewijzen",
            create: "Gebruiker Aanmaken",
            cancel: "Annuleren"
          },
          edit_user: {
            title: "Gebruiker Bewerken",
            description: "Gebruikersinformatie en machtigingen bijwerken",
            // Form fields
            fields: {
              name: "Naam",
              email: "E-mail",
              language_preference: "Taalvoorkeur",
              gender: "Geslacht",
              male: "Man",
              female: "Vrouw",
              status: "Status",
              active: "Actief",
              inactive: "Inactief",
              institution: "Instelling",
              church: "Kerk",
              department: "Afdeling",
              roles: "Rollen"
            },
            // Step descriptions
            steps: {
              personal_info: "Persoonlijke Informatie",
              personal_info_description: "Voer basisgebruikersgegevens in",
              organizational_info: "Organisatie Informatie",
              organizational_info_description: "Selecteer instelling, kerk en afdeling (optioneel)",
              assign_roles: "Rollen Toewijzen",
              assign_roles_description: "Selecteer een of meer rollen voor deze gebruiker"
            },
            // Status messages
            status: {
              active_description: "Gebruiker heeft toegang tot het systeem",
              inactive_description: "Gebruiker verliest toegang tot het systeem",
              part_of_department: "Deel van een Afdeling?",
              part_of_department_description: "Is deze gebruiker deel van een afdeling?",
              no_church_departments: "Geen kerkafdelingen beschikbaar",
              no_institutional_departments: "Geen institutionele afdelingen beschikbaar",
              no_roles_assigned: "Geen rollen toegewezen"
            },
            // Department tabs
            departments: {
              church_departments: "Kerkafdelingen",
              institutional_departments: "Institutionele Afdelingen"
            },
            // Role categories
            categories: {
              all: "Alle",
              administration: "Administratie",
              church: "Kerk",
              institutional: "Institutioneel",
              leadership: "Leiderschap",
              member: "Lid"
            },
            // Buttons
            buttons: {
              back: "Terug",
              cancel: "Annuleren",
              continue: "Doorgaan",
              update_user: "Gebruiker Bijwerken",
              updating: "Bijwerken..."
            },
            // Progress
            progress: {
              step: "Stap",
              of: "van",
              percent: "%"
            },
            // Error messages
            errors: {
              name_required: "Naam is verplicht",
              email_required: "E-mail is verplicht",
              language_required: "Taal is verplicht",
              institution_required: "Instelling is verplicht",
              department_required: "Selecteer een afdeling",
              roles_required: "Wijs ten minste één rol toe",
              fill_all_fields: "Vul alle verplichte velden in"
            },
            // Success messages
            toasts: {
              updating_user: "Gebruiker bijwerken...",
              user_updated: "Gebruiker succesvol bijgewerkt",
              user_update_failed: "Kon gebruiker niet bijwerken"
            },
            // Placeholders
            placeholders: {
              select_language: "Selecteer taal",
              select_institution: "Selecteer instelling",
              select_church: "Selecteer kerk",
              search_departments: "Zoek afdelingen...",
              search_roles: "Zoek rollen..."
            },
            // Filter labels
            filters: {
              filter_by_category: "Filter op Categorie"
            },
            save: "Wijzigingen Opslaan"
          },
          delete_user: {
            title: "Gebruiker Verwijderen",
            description: "Deze actie kan niet ongedaan worden gemaakt. De gebruiker wordt soft verwijderd.",
            confirm_warning: "Weet u zeker dat u deze gebruiker wilt verwijderen?",
            confirm_note: "De gebruiker wordt gedeactiveerd en gemarkeerd als verwijderd",
            delete: "Gebruiker Verwijderen",
            deactivate_title: "Gebruikerstoegang Deactiveren",
            deactivate_description: "Deze actie zal de toegang van de gebruiker tot het systeem verwijderen terwijl alle gegevens behouden blijven",
            view_consequences: "Bekijk Gevolgen",
            understand_consequences: "Ik begrijp de consequenties",
            acknowledge_text: "Ik erken dat deze gebruiker toegang tot het systeem en alle bijbehorende privileges zal verliezen",
            type_confirmation: "Typ \"DELETE USER\" om deze actie te bevestigen:",
            confirmation_placeholder: "DELETE USER",
            confirmation_help: "Deze bevestiging zorgt ervoor dat u begrijpt welke actie wordt uitgevoerd",
            deactivate_user: "Gebruiker Deactiveren",
            deactivating: "Deactiveren...",
            consequences: {
              login_access: "Inlogtoegang Ingetrokken",
              login_access_desc: "Gebruiker kan niet meer authenticeren of toegang krijgen tot het systeem",
              data_preservation: "Gegevens Bewaring",
              data_preservation_desc: "Alle historische records, subsidies en rapporten worden bewaard",
              role_assignments: "Roltoewijzingen",
              role_assignments_desc: "Alle roltoewijzingen worden geschorst maar kunnen worden hersteld"
            },
            soft_delete: {
              title: "Zachte Verwijdering",
              description: "De gebruiker wordt gedeactiveerd maar niet permanent verwijderd. Alle gegevens worden bewaard en kunnen indien nodig worden hersteld."
            }
          },
          user_details: {
            title: "Gebruikersdetails",
            description: "Complete gebruikersinformatie en geschiedenis",
            basic_info: "Basisinformatie",
            contact_info: "Contactinformatie",
            system_info: "Systeeminformatie"
          }
        },
        toasts: {
          user_created: "Gebruiker succesvol aangemaakt",
          user_updated: "Gebruiker succesvol bijgewerkt",
          user_deleted: "Gebruiker succesvol verwijderd",
          role_created: "Rol succesvol aangemaakt",
          role_updated: "Rol succesvol bijgewerkt",
          role_deleted: "Rol succesvol verwijderd",
          role_assigned: "Rol succesvol toegewezen",
          role_removed: "Rol succesvol verwijderd",
          permissions_updated: "Machtigingen succesvol bijgewerkt",
          access_denied: "Toegang geweigerd - onvoldoende machtigingen",
          creating_role: "Rol aanmaken...",
          updating_role: "Rol bijwerken...",
          deleting_role: "Rol verwijderen...",
          role_create_failed: "Kon rol niet aanmaken"
        }
      },

      subsidy: subsidyManagementTranslations.pt,
      projectRegister: projectRegisterTranslations.pt
    }
  }
}

// Initialize i18n
const initializeI18n = async () => {
  if (!i18n.isInitialized) {
    try {
      // Set a timeout for initialization
      const initPromise = i18n
        .use(initReactI18next)
        .init({
          resources,
          lng: 'en', // idioma padrão
          fallbackLng: 'en',
          interpolation: {
            escapeValue: false
          },
          react: {
            useSuspense: false
          },
          debug: false,
          // Performance optimizations
          load: 'languageOnly', // Only load language, not regional variants
          preload: ['en'], // Preload default language
          initImmediate: true, // Initialize immediately without waiting
        })

      // Timeout after 2 seconds
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('i18n initialization timeout')), 2000)
      )

      await Promise.race([initPromise, timeoutPromise])
      
      // Load saved language preference after initialization
      if (typeof window !== 'undefined') {
        const savedLanguage = localStorage.getItem('preferred-language')
        if (savedLanguage && savedLanguage !== 'en' && typeof i18n.changeLanguage === 'function') {
          i18n.changeLanguage(savedLanguage).catch(err => {
            console.warn('[i18n] Failed to load saved language, using EN:', err)
          })
        }
      }
    } catch (error) {
      console.error('[i18n] Failed to initialize, falling back to EN:', error)
      // Ensure we have at least EN as fallback
      if (!i18n.isInitialized) {
        try {
          // Force a minimal initialization with EN
          await i18n.use(initReactI18next).init({
            resources: { en: resources.en },
            lng: 'en',
            fallbackLng: 'en',
            interpolation: { escapeValue: false },
            react: { useSuspense: false }
          })
        } catch (fallbackError) {
          console.error('[i18n] Critical: Failed to set fallback language', fallbackError)
        }
      }
    }
  }
}

// Initialize immediately
initializeI18n()

export default i18n
// Temporary fix - add projectRegister to pt manually
