#!/bin/bash

###########################################################################
#	配置项

#	项目名称
PROJECT_HOME="/home/dev/upload/chance_group/"

#       服务名
SERVER_NAME="bw_chance_uat"

#	线上集群列表
online_clusters="10.6.4.63";
#online_clusters="10.10.220.11";

#	测试机器
beta_clusters="10.10.215.4";

#	目标机器的目录
dst="/data/htdocs/brandwisdom/chanceGroupApi/BW.RD_Chance_Group";

#	同步所使用的用户
ssh_user="jointwisdomweb";

#	文件黑名单
blacklist='(.*\.tmp$)|(.*\.log$)|(.*\.svn.*)|(.*\.git.*)'


###########################################################################
#	公共库

#	print colored text
#	$1 = message
#	$2 = color

#	格式化输出
export black='\E[0m\c'
export boldblack='\E[1;0m\c'
export red='\E[31m\c'
export boldred='\E[1;31m\c'
export green='\E[32m\c'
export boldgreen='\E[1;32m\c'
export yellow='\E[33m\c'
export boldyellow='\E[1;33m\c'
export blue='\E[34m\c'
export boldblue='\E[1;34m\c'
export magenta='\E[35m\c'
export boldmagenta='\E[1;35m\c'
export cyan='\E[36m\c'
export boldcyan='\E[1;36m\c'
export white='\E[37m\c'
export boldwhite='\E[1;37m\c'

cecho()
{
	message=$1
	color=${2:-$black}

	echo -e "$color"
	echo -e "$message"
	tput sgr0			# Reset to normal.
	echo -e "$black"
	return
}

cread()
{
	color=${4:-$black}

	echo -e "$color"
	read $1 "$2" $3 
	tput sgr0			# Reset to normal.
	echo -e "$black"
	return
}

#	确认用户的输入
deploy_confirm()
{
	while [ 1 = 1 ]
	do
		cread -p "$1 [y/n]: " CONTINUE $c_notify 	  
		if [ "y" = "$CONTINUE" ]; then
		  return 1;
		fi

		if [ "n" = "$CONTINUE" ]; then
		  return 0;
		fi
	done

	return 0;
}


###########################################################################
#	Start

#export LC_ALL="UTF-8"

#PROJECT_HOME=`echo "echo \$""${project}_HOME" | sh`

#	确定根目录
if [ -z "$PROJECT_HOME" ]; then
	echo "先置当前用户工作根目录的环境变量：$PROJECT_HOME"
	exit
fi

prj_nam=`basename $dst`

#	
SSH="ssh uat"
SCP="sudo -u $ssh_user scp -c blowfish"

#	提示颜色
c_notify=$boldcyan
c_error=$boldred

