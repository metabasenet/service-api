## setup db
```bash
sudo apt install mysql-server
sudo mysql -u root
mysql> use mysql;
mysql> CREATE USER 'mnt'@'localhost' IDENTIFIED BY '1234qwer';
mysql> GRANT ALL ON *.* TO 'mnt'@'localhost';
mysql> ALTER USER 'mnt'@'localhost' IDENTIFIED WITH mysql_native_password BY '1234qwer';
mysql> FLUSH PRIVILEGES;
mysql> select User,plugin,host from user;
+------------------+-----------------------+-----------+
| User             | plugin                | host      |
+------------------+-----------------------+-----------+
| root             | auth_socket           | localhost |
| mysql.session    | mysql_native_password | localhost |
| mysql.sys        | mysql_native_password | localhost |
| debian-sys-maint | mysql_native_password | localhost |
| mnt              | mysql_native_password | localhost |
+------------------+-----------------------+-----------+
5 rows in set (0.00 sec)

# mysql_native_password
sudo apt install mysql-workbench
## 
#https://downloads.mysql.com/archives/workbench/
sudo dpkg -i ***.dev

```
## setup index
```bash
yarn
yarn start

ssh -4NfL 3306:127.0.0.1:3306 mnt-xg2
ssh -4NfL 7545:127.0.0.1:7545 mnt-xg2

```