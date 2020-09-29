#!/bin/bash

###########################################################################
#       配置项

#   include lib
this_file=`pwd`"/"$0
this_dir=`dirname $this_file`
. $this_dir/deploy.sh

#   建立零时文件
DEPLOY_DIR="$HOME/deploy"
rm -rf $prj_nam

#   从仓库拉取最新代码
git clone git@gitlab.brandwisdom.cn:brandwisdomfrontend/$prj_nam.git

if [ ! -f $prj_nam ]
        then
                echo  "${$prj_nam}拉取失败"
                exit 1;
        fi

#       源文件打包
echo "\n=== 文件打包 === \n"
time=`date "+%Y%m%d%H%M%S"`
src_tgz="$HOME/$prj_nam.${USER}.${time}.tgz"
tar cvfz $src_tgz -C $PROJECT_HOME $files > /dev/null 2>&1
echo "$src_tgz"
if [ ! -s "$src_tgz" ]; then
    echo "错误：文件打包失败"
    exit 1
fi

for host in ${online_clusters}
do
	echo "\n=== ${host} ===\n"

	#       上传源文件
    dst_src_tgz=`basename $src_tgz`
    scp $src_tgz uat/$dst_src_tgz > /dev/null 2>&1

    $SSH $host "test -s ~/$dst_src_tgz"
    if [ 0 -ne $? ]; then
            echo "\t错误：文件上传失败"
            exit 1
    fi

    #       备份原始文件
    echo "\n\t--- 备份原始文件 ---\n"
    bak_src_tgz="~$ssh_user/bak.${prj_nam}.${USER}.${time}.tgz"
    $SSH $host tar cvhfz ${bak_src_tgz} -C $dst $files > /dev/null 2>&1
    echo "\t${bak_src_tgz}"

    $SSH $host "test -s $bak_src_tgz"
    if [ 0 -ne $? ]; then
            echo "\t错误：远程主机原始文件备份失败"
            exit 1
    fi

	#       展开源文件
    echo "\n\t--- 部署文件 ---\n"
    $SSH $host "env LC_CTYPE=zh_CN.GB2312 tar xvfz ~/$dst_src_tgz -C $dst" 2>&1 | sed -e 's/^/      /'

    if [ 0 != $? ]
    then
            echo "\t错误：部署文件失败"
            deploy_confirm "        继续部署？"
            if [ 1 != $? ]; then
                    exit 1;
            fi
    fi
    #       重启node
    $SSH $host "pm2 reload ${SERVER_NAME}"

    #   提示验证部署效果
    verify="    --- 上线完毕，执行此命令恢复原始版本： $SSH $host tar xvfz $bak_src_tgz -C $dst ";

    if [ "$host" = "$host1" ]
    then
            echo ""
            deploy_confirm "$verify，请验证效果"
            if [ 1 != $? ]; then
                    exit 1;
            fi
    else
            echo "\n$verify \n"
            rm -f $PROJECT_HOME/tools/revert.sh
            echo "$SSH $host tar xvfz $bak_src_tgz -C $dst" >> $PROJECT_HOME/tools/revert.sh
    fi
done

#       清理垃圾
rm -rf $src_tgz

if [ ! -z "$DEPLOY_DIR" ]
then
        rm -rf $DEPLOY_DIR
fi

echo "\n=== 上线完毕 ===\n"

