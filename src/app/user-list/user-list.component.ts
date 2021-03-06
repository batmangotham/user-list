import { UserDialogComponent } from "./dialog/user-dialog.component";
import { ApiService } from "./../services/api.service";
import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
@Component({
  templateUrl: "list.html"
})
export class UserListComponent implements OnInit {
  users: any = {};
  query: any = {};
  params: any = {};
  constructor(private userService: ApiService, public dialog: MatDialog) {}

  ngOnInit() {
    this.users["toggleId"] = false;
    this.users["toggleName"] = false;
    this.users["since"] = 0;
    this.query["name"] = "";
    this.query["id"] = null;
    this.users["total"] = 100;
    this.users["per_page"] = 10;
    this.getUsers();
  }

  getUsers() {
    this.users["loading"] = true;
    let param: any = {};
    param["since"] = this.users["since"];
    param["per_page"] = this.users["per_page"];
    this.userService.getData("users", param).subscribe(res => {
      if (res) {
        this.users["data"] = res;
        this.users["newData"] = res;
        this.users["loading"] = false;
      }
    });
  }

  filterSearch(ev) {
    console.log(ev);
    this.users["newData"] = this.users["data"].filter(el => {
      return el.login.toLowerCase().indexOf(ev.toLowerCase()) > -1;
    });
  }

  filterById(ev) {
    if (ev) {
      this.users["newData"] = this.users["data"].filter(el => el.id === ev);
    } else {
      this.users["newData"] = this.users["data"];
    }
  }

  sortById() {
    this.users["toggleId"] = !this.users["toggleId"];
    if (this.users["toggleId"]) {
      console.log("Desc");
      this.users["newData"] = this.users["data"].sort((a, b) => {
        return a.id < b.id ? 1 : 0;
      });
    } else {
      this.users["newData"] = this.users["data"].sort((a, b) => {
        return a.id > b.id ? 1 : 0;
      });
    }
  }

  sortByName() {
    this.users["toggleName"] = !this.users["toggleName"];
    if (this.users["toggleName"]) {
      console.log("Desc");
      this.users["newData"] = this.users["data"].sort((a, b) => {
        return a.login < b.login ? 1 : 0;
      });
    } else {
      this.users["newData"] = this.users["data"].sort((a, b) => {
        return a.login > b.login ? 1 : 0;
      });
    }
  }

  openDialog(name: string, isEdit: boolean) {
    let dialogRef = this.dialog.open(UserDialogComponent, {
      width: "250px",
      data: { name: name, edit: isEdit },
      panelClass: "user-dialog"
    });
  }

  onNavigate(ev) {
    this.users["since"] = ev;
    this.getUsers();
  }

  getUserDetails() {
    this.userService
      .getData("users/" + this.users["currentUser"], {})
      .subscribe(res => {
        this.users["userData"] = res;
      });
  }

  editUser(user: string) {
    this.users["currentUser"] = user;
    this.getUserDetails();
  }

  deleteUser(index) {
    console.log(index);
    this.users["newData"].splice(index, 1);
  }
}
